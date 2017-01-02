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


class JsonUiSchemaUtil {

  private static Map genUiSchemaFromConstraints(GrailsDomainClass domainClass, GrailsDomainClassProperty property) {
    Map result = [:]
    Map constrainedProperties = domainClass.getConstrainedProperties()
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
        result += ['ui:widget':constrainedProperties[property.name]?.widget] // widget is "textarea"" or something.
      }
      if (constrainedProperties[property.name]?.display == false) {
        // hidden overwrite password/widget
        result += ['ui:widget':'hidden']
      }
    }
    return result
  }

  private static Map genUiSchemaFromAssociations(GrailsDomainClass domainClass, GrailsDomainClassProperty property) {
    if (property.manyToOne || property.oneToOne) {
      return ['ui:field':'manyToOne']
    }
    if (property.oneToMany) {
      return ['ui:field':'oneToMany']
    }
    return [:]
  }

  static Map genUiSchema(GrailsDomainClass domainClass) {
    def properties = JsonSchemaUtil.reorderProperties(JsonSchemaUtil.resolveProperties(domainClass))
    def result = properties.collectEntries { property ->
      Map value = [*:genUiSchemaFromConstraints(domainClass, property),
                   *:genUiSchemaFromAssociations(domainClass, property)]
      return (value == [:] ? [:] : [(property.name): value])
    }
    return result
  }

}
