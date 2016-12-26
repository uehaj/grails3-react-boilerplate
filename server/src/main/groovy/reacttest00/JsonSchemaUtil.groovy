package reacttest00

import org.grails.validation.*
import org.grails.orm.hibernate.cfg.GrailsDomainBinder
import org.grails.orm.hibernate.cfg.AbstractGrailsDomainBinder

/**

GORM constraints to Json Schema convert utility.

Grails basic constraints support:
  - [NA]attributes
  - [NA]bindable
  - [v]blank -> JSON Schema { "minLength": 1 } or { "minLength": 0 }
  - [NA]creditCard
  - [v]email -> JSON Schema { format: "email" }
  - [v]inList -> JSON Schema { "enum": ["elem1", "elem2", "elem3"] }
  - [v]matches -> JSON Schema { "pattern": "RE" }
  - [v]max -> JSON Schema { "maximum": val }
  - [v]maxSize -> JSON Schema { "maxLength": val }
  - [v]min -> JSON Schema { "minimum": val }
  - [v]minSize -> JSON Schema { "minLength": val }
  - [v]notEqual -> JSON Schema { "not": { "enum": ["value"]  } }
  - [NA]nullable
  - [v]range -> JSON Schema { "minimum": v1, maximum": v2 }
  - [NA]scale
  - [v]size -> JSON Schema { "minLength": v1, "maxLength": v2 }
  - [NA]unique
  - [v]url -> JSON Schema { format: "uri" }
  - [NA]validator

Grails constraints for Scaffolding support:

  - [v]editable -> UI Schema { "ui:readonly":true }
  - [NA]format
  - [v]password -> UI Schema { "ui:widget":"password" }
  - [v]widget -> UI Schema { "ui:widget": ... }
  - [v]display -> UI Schema{ "ui:widget":"hidden" }

Other:

  - [ ]deafult value -> JSON Schema { "default": value }

@see http://json-schema.org/latest/json-schema-validation.html
*/


import grails.core.GrailsDomainClass
import grails.core.GrailsDomainClassProperty
import grails.persistence.Event


class JsonSchemaUtil {

  private static String[] excludedProperties = Event.allEvents.toList() << 'dateCreated' << 'lastUpdated'

  private static Map<String, String> mapType(Class type) {
    switch (type) {
    case java.lang.Byte:
    case java.lang.Character:
    case java.lang.Short:
    case java.lang.Integer:
    case java.lang.Long:
    case java.lang.Float:
    case java.lang.Double:
        return [type: "number"]
    case java.lang.Boolean:
        return [type: "boolean"]
    case java.util.Date:
        return [type: "string", format:"date-time"]
    case java.lang.String:
        return [type: "string"]
    default:
        return [type: "string"]
    }
  }

  private static Map constraintsToSchema(constraint) {
    def result = [:]
    if (constraint instanceof BlankConstraint) {
      result << [minLength: constraint.blank ? 0 : 1]
    }
    else if (constraint instanceof CreditCardConstraint) {
      // not supported
    }
    else if (constraint instanceof EmailConstraint) {
      result << [format: "email"]
    }
    else if (constraint instanceof InListConstraint) {
      result << ["enum": constraint.list]
    }
    else if (constraint instanceof MatchesConstraint) {
      result << ["pattern": constraint.regex]
    }
    else if (constraint instanceof MaxConstraint) {
      result << ["maximum": constraint.maxValue]
    }
    else if (constraint instanceof MaxSizeConstraint) {
      result << ["maxLength": constraint.maxSize]
    }
    else if (constraint instanceof MinConstraint) {
      result << ["minimum": constraint.minValue]
    }
    else if (constraint instanceof MinSizeConstraint) {
      result << ["minLength": constraint.minSize]
    }
    else if (constraint instanceof NotEqualConstraint) {
      result << ["not": ["enum": [constraint.notEqualTo]]]
    }
    else if (constraint instanceof NullableConstraint) {
      // not supported
    }
    else if (constraint instanceof RangeConstraint) {
      result << ["minimum": constraint.range.from, "maximum": constraint.range.to ] // TODO check exclusive end
    }
    else if (constraint instanceof ScaleConstraint) {
      // not supported
    }
    else if (constraint instanceof SizeConstraint) {
      result << ["minLength": constraint.range.from, "maxLength": constraint.range.to ]
    }
    else if (constraint instanceof UrlConstraint) {
      result << ["format": "uri"]
    }
    else if (constraint instanceof ValidatorConstraint) {
      // not supported
    }
    else {
      throw new Exception("Unknown constraint:"+constraint)
    }
    return result
  }

  static Object genPropertySchema(GrailsDomainClass domainClass, GrailsDomainClassProperty property) {
    def result = [
      *:mapType(property.type),
      title: property.name,
      //description: "field of "+property.name,
    ]
    def constrainedProperties = domainClass.getConstrainedProperties()
    if (constrainedProperties.containsKey(property.name)) {
      constrainedProperties[property.name].appliedConstraints.each { constraint ->
        result += constraintsToSchema(constraint)
      }
    }
    return result
  }

  private static List reorderProperties(properties) {
    // TODO: sort with order of constraints.
    assert properties.find { it.name == 'id' }
    properties = [properties.find { it.name == 'id'} ] + properties.findAll { it.name != 'id' }.reverse()
    return properties
  }

  private static boolean isNullable(domainClass, property) {
    def constrainedProperties = domainClass.getConstrainedProperties()
    if (!constrainedProperties.containsKey(property.name)) {
      return false
    }
    return constrainedProperties[property.name].appliedConstraints.any { constraint ->
      constraint instanceof NullableConstraint && !constraint.isNullable()
    }
  }

  static resolveProperties(GrailsDomainClass domainClass) {
    def propNames = domainClass.properties*.name
    def persistentPropNames = domainClass.persistentProperties*.name
    if ('id' in propNames) {
      persistentPropNames << 'id'
    }
    if ('version' in propNames) {
      persistentPropNames << 'version'
    }
    return domainClass.properties.findAll { persistentPropNames.contains(it.name) && !excludedProperties.contains(it.name) }
  }

  static Object genSchema(GrailsDomainClass domainClass) {
    def properties = resolveProperties(domainClass)
    properties = reorderProperties(properties)

    def requiredProperties = properties.findAll { property ->
      isNullable(domainClass, property)
    }

    properties = properties.collectEntries { property ->
      def value = genPropertySchema(domainClass, property)
      if (property.name == 'version') {
        value += ['default': 0] // version fields' default value is 0
      }
      return [(property.name): value]
    }

    def result = [
      '$schema': "http://json-schema.org/schema#",
      title: domainClass.getShortName(),
      type: 'object',
      required: requiredProperties.name,
      properties: properties
    ]
    return result
  }

  static Object genPropertyUiSchema(GrailsDomainClass domainClass, GrailsDomainClassProperty property) {
    def result = [:]
    def constrainedProperties = domainClass.getConstrainedProperties()
    if (constrainedProperties.containsKey(property.name)) {
      if (constrainedProperties[property.name]?.editable == false) {
        result += ['ui:readonly':true]
      }
      if (constrainedProperties[property.name]?.format) {
        // not supported
      }
      if (constrainedProperties[property.name]?.password) {
        result += ['ui:widget':'password']
      }
      if (constrainedProperties[property.name]?.widget) {
        // widget overwrite password
        result += ['ui:widget':constrainedProperties[property.name]?.widget]
      }
      if (constrainedProperties[property.name]?.display == false) {
        // hidden overwrite password/widget
        result += ['ui:widget':'hidden']
      }
    }
    return result
  }

  static Object genUiSchema(GrailsDomainClass domainClass) {
    def properties = reorderProperties(resolveProperties(domainClass))
    def result = properties.collectEntries { property ->
      def value = genPropertyUiSchema(domainClass, property)
      if (property.name == 'version') {
         value << ['default':0]
         value << ['ui:widget':'hidden']
       }
      return value == [:] ? [:] : [(property.name): value]
    }
    return result
  }

}
