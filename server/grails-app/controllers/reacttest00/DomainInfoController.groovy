package reacttest00

import grails.core.GrailsApplication
import grails.util.Environment
import static org.springframework.http.HttpStatus.*
import grails.converters.JSON

class DomainInfoController {

    GrailsApplication grailsApplication

    static responseFormats = ['json']

    private Object getSchema(String domainClassName) {
        def domainClass = grailsApplication.getDomainClass(domainClassName)
        def result = JsonSchemaUtil.genSchema(domainClass)
        return result
    }

    private Object getUiSchema(String domainClassName) {
        def domainClass = grailsApplication.getDomainClass(domainClassName)
        def result = JsonSchemaUtil.genUiSchema(domainClass)
        return result
    }

    def index(Integer max) {
        params.max = Math.min(max ?: 10, 100)
        render grailsApplication.getArtefacts("Domain").collect {
            [fullName: it.fullName,
             name: it.name,
             schema: JsonSchemaUtil.getSchema(it.fullName),
             uiSchema: JsonSchemaUtil.getUiSchema(it.fullName),
            ]
        } as JSON
    }

    def show() {
        for (domainClass in grailsApplication.getArtefacts("Domain")) {
            def className = params.id.replaceAll(/^(.)(.*$)/) { g0, g1, g2 ->
                g1.toUpperCase() + g2
            }
            if (className == domainClass.name) {
                render getSchema(domainClass.fullName) as JSON
                return
            }
        }
        response.status = 404;
    }

}
