package reacttest00

import org.grails.validation.*

/**

 converter utility.

Grails constraints support:
  [NA?]attributes
  [NA]bindable
  [ ]blank
  { "minLength": 1 } or { "minLength": 0 }
  http://json-schema.org/latest/json-schema-validation.html#rfc.section.5.7
  [NA]creditCard
  [ ]email
  { format: "email" }
  http://json-schema.org/latest/json-schema-validation.html#rfc.section.7.3.2
  [ ]inList
  { "enum": ["elem1", "elem2", "elem3"] }
    http://json-schema.org/latest/json-schema-validation.html#rfc.section.5.20
  [ ]matches
  { "pattern": "RE" }
  http://json-schema.org/latest/json-schema-validation.html#rfc.section.5.8
  [ ]max
  { "maximum": val }
  http://json-schema.org/latest/json-schema-validation.html#rfc.section.5.2
  [ ]maxSize
  { "maxLength": val }
  http://json-schema.org/latest/json-schema-validation.html#rfc.section.5.2
  [ ]min
  { "minimum": val }
  http://json-schema.org/latest/json-schema-validation.html#rfc.section.5.4
  [ ]minSize
  { "minLength": val }
  http://json-schema.org/latest/json-schema-validation.html#rfc.section.5.7
  [ ]notEqual
  { "not": { "enum": ["value"]  } }
  [NA]nullable
  [ ]range
  { "minimum": v1, maximum": v2 }
  [NA]scale
  [ ]size
  { "minLength": v1, "maxLength": v2 }
  [NA]unique
  [ ]url
  { format: "uri" }
  http://json-schema.org/latest/json-schema-validation.html#rfc.section.7.3.6
  [NA]validator
  [ ]widget
  (UIScema) { "ui:widget":"textarea" }
  
  --
  [ ]deafult value
  { "default": value }
  http://json-schema.org/latest/json-schema-validation.html#rfc.section.6.2

http://json-schema.org/documentation.html

@see http://json-schema.org/latest/json-schema-validation.html
*/


import grails.core.GrailsDomainClass
import grails.core.GrailsDomainClassProperty

class JsonSchemaUtil {

  private List<String> excludesProperties = ['version']

  private static String mapType(Class type) {
    switch (type) {
    case java.lang.Byte:
    case java.lang.Character:
    case java.lang.Short:
    case java.lang.Integer:
    case java.lang.Long:
    case java.lang.Float:
    case java.lang.Double:
        return "number"
    case java.lang.Boolean:
        return "boolean"
    case java.lang.String:
        return "string"
    default:
        return "object"
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
      result << ["maximum": constraint.minValue]
    }
    else if (constraint instanceof MinSizeConstraint) {
      result << ["maxLength": constraint.minSize]
    }
    else if (constraint instanceof NotEqualConstraint) {
      result << ["not": ["enum": [constraint.notEqualTo]]]
    }
    else if (constraint instanceof NullableConstraint) {
      // not supported
    }
    else if (constraint instanceof RangeConstraint) {
      result << ["minimum": constraint.range.from, "maximum": constraint.range.from ] // TODO check exclusive end
    }
    else if (constraint instanceof ScaleConstraint) {
      // not supported
    }
    else if (constraint instanceof SizeConstraint) {
      result << ["minLength": constraint.range.from, "maxLength": constraint.range.from ] // TODO check exclusive end
    }
    else if (constraint instanceof UrlConstraint) {
      result << ["format": "uri"]
    }
    else if (constraint instanceof ValidatorConstraint) {
      // not supported
    }
    else {
      throw new Exception("Unknown exception")
    }
    return result
  }

  static Object genPropertySchema(GrailsDomainClass domainClass, GrailsDomainClassProperty property) {
    def result = [
      type: mapType(property.type),
      title: property.name,
      description: "field of "+property.name,
    ]
    def constraints = domainClass.getConstrainedProperties()
    if (constraints.containsKey(property.name)) {
      result = constraintsToSchema(constraints[property.name])
    }
    return result
  }

  private static List filterProperties(properties) {
      properties.findAll { !(it.name in excludesProperties) }
  }

  private static List reorderProperties(properties) {
    // TODO: sort with order of constraints.
    assert properties.find { it.name == 'id' }
    properties = [properties.find { it.name == 'id'} ] + properties.findAll { it.name != 'id' }.reverse()
  }

  static Object genSchema(GrailsDomainClass domainClass) {
    def properties = domainClass.getDomainProperties()
    properties = filterProperties(properties)
    properties = reorderProperties(properties)

    def result = [
      '$schema': "http://json-schema.org/schema#",
      title: domainClass.getShortName(),
      type: 'object',
      required: properties.name,
      properties: properties.collectEntries { property ->
        return [(property.name): genPropertySchema(domainClass, property)]
      }
    ]
    return result
  }

  static Object genUiSchema(GrailsDomainClass domainClass) {
    return [:]
  }

}
