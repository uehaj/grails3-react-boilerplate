package sample

import grails.test.mixin.integration.Integration
import spock.lang.Specification
import spock.lang.Unroll
import reacttest00.JsonSchemaUtil
import org.springframework.beans.factory.annotation.*

import grails.util.Holders

@Integration
class JsonSchemaUtilSpec extends Specification {

    @Unroll
    def "mapType(#type) is #result"() {
        expect:
        JsonSchemaUtil.mapType(Byte) == "number"
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

    @Unroll
    def "constraintsToSchema()"() {
    }

/*    @Unroll
    def "getSchema"() {
    setup:
    println JsonSchemaUtil.genSchema(Book)
    }*/
}
