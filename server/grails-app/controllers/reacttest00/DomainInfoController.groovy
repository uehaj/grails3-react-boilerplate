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
        def result = UiSchemaUtil.genUiSchema(domainClass)
        return result
    }

    private Object domainInfo(domainClass) {
        return [fullName: domainClass.fullName,
                name: domainClass.name,
                schema: getSchema(domainClass.fullName),
                uiSchema: getUiSchema(domainClass.fullName),
               ]
    }

    def index(Integer max) {
        params.max = Math.min(max ?: 10, 100)
        render grailsApplication.getArtefacts("Domain").collect {
          domainInfo(it)
        } as JSON
    }

    def show() {
        for (domainClass in grailsApplication.getArtefacts("Domain")) {
            def className = params.id.replaceAll(/^(.)(.*$)/) { g0, g1, g2 ->
                g1.toUpperCase() + g2
            }
            if (className == domainClass.name) {
                render(domainInfo(domainClass) as JSON)
                return
            }
        }
        response.status = 404;
    }

}
