package reacttest00

import grails.core.GrailsApplication
import grails.util.Environment
import static org.springframework.http.HttpStatus.*
import grails.converters.JSON

class DomainInfoController {

    GrailsApplication grailsApplication

    static responseFormats = ['json']

    List<String> excludesProperties = ['version']

    private Object filterProperties(properties) {
        properties.findAll { !(it.name in excludesProperties) }
    }

    private String mapType(Class type) {
    println type
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

    private Object getSchema(domainClassName) {
        def domainClass = grailsApplication.getDomainClass(domainClassName)
        def properties = filterProperties(domainClass.properties)
        println properties
        def result = [
            title: domainClass.getShortName(),
            type: 'object',
            required: properties.name,
            properties: properties.collectEntries { property ->
                return [(property.name): [ type: mapType(property.type),
                                           title: property.name ]]
            }
        ]
        return result
    }

    def index(Integer max) {
        params.max = Math.min(max ?: 10, 100)
        render grailsApplication.getArtefacts("Domain").collect {
            [fullName: it.fullName,
             name: it.name,
             schema: getSchema(it.fullName),
            ]
        } as JSON
    }

    def show() {
        for (domainClass in grailsApplication.getArtefacts("Domain")) {
            def className = params.id.replaceAll(/^(.)(.*$)/) { g0, g1, g2 ->
                g1.toUpperCase() + g2
            }
            println className
            if (className == domainClass.name) {
                render getSchema(domainClass.fullName) as JSON
                return
            }
        }
        response.status = 404;
    }

}
