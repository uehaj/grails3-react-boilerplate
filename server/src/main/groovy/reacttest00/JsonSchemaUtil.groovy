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

  private static List<String> excludedProperties = Event.allEvents.toList() << 'dateCreated' << 'lastUpdated'

  private static Map genSchemaManyToOne(GrailsDomainClassProperty property) {
    return [ type: 'object',
             associationType: "many-to-one",
             required: 'id',
             properties: [
             id: [ type: 'number',
                   enum: property.type.list().id,
                   enumNames: property.type.list().collect{ it.toString() }
                 ] // return Custom labels for enum fields
             ]
           ];
  }

  private static Map genSchemaOneToMany(GrailsDomainClassProperty property) {
    Class type = property.type;
    def cls = property.referencedDomainClass?.clazz
    if(cls == null) {
      if(property.type instanceof Collection) {
        cls = org.springframework.core.GenericCollectionTypeResolver.getCollectionType(property.type)
      }
    }

    return [ type: 'array',
             associationType: "one-to-many",
             items:
             [ type: 'object',
               'domainClass': cls, // not in json schema specificication.
               required: 'id',
               properties: [
                 id: [ type: 'number' ]
               ]
             ]
           ];
  }

  private static Map<String, String> genSchemaTypeAndTitle(GrailsDomainClassProperty property) {
    Map result = [title: property.name];
    Class type = property.type;
    switch (type) {
    case byte.class:
    case short.class:
    case int.class:
    case long.class:
    case float.class:
    case double.class:
    case java.lang.Byte:
    case java.lang.Short:
    case java.lang.Integer:
    case java.lang.Long:
    case java.lang.Float:
    case java.lang.Double:
        return [type: 'number', *:result]
    case boolean.class:
    case java.lang.Boolean:
       return [type: 'boolean', *:result]
    case java.util.Date:
        return [type: 'string', format:'date-time', *:result]
    case char.class:
    case java.lang.Character:
    case java.lang.String:
        return [type: 'string', *:result]
    default:
        if (property.manyToOne || property.oneToOne) {
          return [*:genSchemaManyToOne(property), *:result]
        }
        if (property.oneToMany) {
          return [*:genSchemaOneToMany(property), *:result]
        }
        return [type: 'string', *:result]
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
      result << [format: 'email']
    }
    else if (constraint instanceof InListConstraint) {
      result << ['enum': constraint.list]
    }
    else if (constraint instanceof MatchesConstraint) {
      result << ['pattern': constraint.regex]
    }
    else if (constraint instanceof MaxConstraint) {
      result << ['maximum': constraint.maxValue]
    }
    else if (constraint instanceof MaxSizeConstraint) {
      result << ['maxLength': constraint.maxSize]
    }
    else if (constraint instanceof MinConstraint) {
      result << ['minimum': constraint.minValue]
    }
    else if (constraint instanceof MinSizeConstraint) {
      result << ['minLength': constraint.minSize]
    }
    else if (constraint instanceof NotEqualConstraint) {
      result << ['not': ['enum': [constraint.notEqualTo]]]
    }
    else if (constraint instanceof NullableConstraint) {
      // not supported
    }
    else if (constraint instanceof RangeConstraint) {
      result << ['minimum': constraint.range.from, 'maximum': constraint.range.to ] // TODO check exclusive end
    }
    else if (constraint instanceof ScaleConstraint) {
      // not supported
    }
    else if (constraint instanceof SizeConstraint) {
      result << ['minLength': constraint.range.from, 'maxLength': constraint.range.to ]
    }
    else if (constraint instanceof UrlConstraint) {
      result << ['format': 'uri']
    }
    else if (constraint instanceof ValidatorConstraint) {
      // not supported
    }
    else {
      throw new Exception('Unknown constraint:'+constraint)
    }
    return result
  }

  static Map genSchemaProperty(GrailsDomainClass domainClass, GrailsDomainClassProperty property) {
    Map result = genSchemaTypeAndTitle(property)
    def constrainedProperty = domainClass.constrainedProperties[property.name]
    constrainedProperty?.appliedConstraints?.each { constraint ->
      result += constraintsToSchema(constraint)
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

  static List resolveProperties(GrailsDomainClass domainClass) {
    List propNames = domainClass.properties*.name
    List persistentPropNames = domainClass.persistentProperties*.name
    if ('id' in propNames) {
      persistentPropNames << 'id'
    }
    if ('version' in propNames) {
      persistentPropNames << 'version'
    }
    return domainClass.properties.findAll { persistentPropNames.contains(it.name) && !excludedProperties.contains(it.name) }
  }

  static Map genSchema(GrailsDomainClass domainClass) {
    List propertyList = resolveProperties(domainClass)
    propertyList = reorderProperties(propertyList)

    List requiredProperties = propertyList.findAll { property ->
      isNullable(domainClass, property) &&
      property.type != java.lang.Boolean &&
      property.type != boolean.class
    }

    Map properties = propertyList.collectEntries { property ->
      Map value = genSchemaProperty(domainClass, property)
      if (property.name == 'version') {
        value += ['default': 0] // version fields' default value is 0
      }
      return [(property.name): value]
    }

    Map result = [
      '$schema': 'http://json-schema.org/schema#',
      title: domainClass.getShortName(),
      type: 'object',
      required: requiredProperties.name,
      properties: properties
    ]
    return result
  }

}
