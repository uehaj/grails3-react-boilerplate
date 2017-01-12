package sample

import grails.test.mixin.integration.Integration
import spock.lang.Specification
import spock.lang.Unroll
import org.springframework.beans.factory.annotation.*
import grails.core.GrailsApplication
import reacttest00.JsonSchemaUtil

@Integration
class JsonSchemaUtilSpec extends Specification {

    @Unroll
    def "mapType(#type) is #result"() {
        expect:
        JsonSchemaUtil.genSchemaTypeAndTitle(type) == "number"
        where:
        type|result
        Byte|"number"
        Character|"number"
        Short|"number"
        Long|"number"
        Float|"number"
        Double|"number"
        Boolean|"boolean"
        String|"string"
        Object|"object"
    }

    GrailsApplication grailsApplication

    @Unroll
    def "getPropertySchema Book.#title"() {
        setup:
        def domainClass = grailsApplication.getDomainClass("sample.Book")
        when:
        def schema = JsonSchemaUtil.genPropertySchema(domainClass, domainClass.properties[idx])
        then:
        schema.type == type
        schema.title == title
        where:
        idx|type|title
        0|'number'|'id'
        1|'number'|'price'
        2|'string'|'title'
    }

    @Unroll
    def "getPropertySchema ConstraintTest #name"() {
        setup:
        def domainClass = grailsApplication.getDomainClass("sample.ConstraintTest")
        when:
        def schema = JsonSchemaUtil.genPropertySchema(domainClass, domainClass.properties.find{it.name==name})
        then:
        schema.type == type
        schema.title == title
        test(schema)
        where:
        type|name|title|test
        'string'|'string_blank_true'|'string_blank_true'|{it.minLength == 0}
        'string'|'string_blank_false'|'string_blank_false'|{it.minLength == 1}
        'string'|'string_email'|'string_email'|{it.format == 'email'}
        'string'|'string_inList'|'string_inList'|{it.enum == ["a","b","c"]}
        'number'|'number_inList'|'number_inList'|{it.enum == [1,2,3]}
        'string'|'string_matches'|'string_matches'|{it.pattern == '[A-Z][a-z]*'}
        'number'|'number_min_10'|'number_min_10'|{it.minimum == 10}
        'number'|'number_max_20'|'number_max_20'|{it.maximum == 20}
        'number'|'number_range_10_20'|'number_range_10_20'|{it.minimum == 10 && it.maximum == 20}
        'string'|'string_minSize_10'|'string_minSize_10'|{it.minLength==10}
        'string'|'string_maxSize_20'|'string_maxSize_20'|{it.maxLength==20}
        'string'|'string_size_10_20'|'string_size_10_20'|{it.minLength==10&&it.maxLength==20}
        'string'|'string_url'|'string_url'|{it.format == 'uri'}
    }

    @Unroll
    def "getPropertyUiSchema ConstraintTest #name"() {
        setup:
        def domainClass = grailsApplication.getDomainClass("sample.ConstraintTest")
        when:
        def uiSchema = JsonSchemaUtil.genPropertyUiSchema(domainClass, domainClass.properties.find{it.name==name})
        then:
        test(uiSchema)
        where:
        name|test
        'string_display_false'|{it.'ui:widget' == 'hidden'}
        'string_editable_false'|{it.'ui:readonly' == true}
        'string_password_true'|{it.'ui:widget' == 'password'}
        'string_widget_textarea'|{it.'ui:widget' == 'textarea'}
    }

    def "getSchema sample.Book"() {
        setup:
        def domainClass = grailsApplication.getDomainClass("sample.Book")
        when:
        def schema = JsonSchemaUtil.genSchema(domainClass)
        then:
        schema.type == 'object'
        schema.title == 'Book'
        schema.properties.id.type == 'number'
        schema.properties.id.title == 'id'
        schema.properties.price.type == 'number'
        schema.properties.price.title == 'price'
        schema.properties.title.type == 'string'
        schema.properties.title.title == 'title'
    }
}
