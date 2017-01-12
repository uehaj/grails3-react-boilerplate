package reacttest00

import grails.core.GrailsApplication
import sample.Book
import grails.converters.JSON

class SearchController {

    static final SEARCH_PARAMS_KEYS = [ 'sort', 'order', 'max', 'offset', 'distinct' ]

    GrailsApplication grailsApplication

    def quickSearchService

    static responseFormats = ['json']

    static Map pickUpSearchParams(grails.web.servlet.mvc.GrailsParameterMap params) {
      return params.collectEntries { k, v -> (k.toLowerCase() in SEARCH_PARAMS_KEYS) ? [k,v] : [] }
    }

    static final REQUIRED_PARAMS = ['domainClass', 'searchTargetField', 'query']

    /**
     * Search API.
     *
     * API Params:
     *  - domainClass
     *  - searchTargetField
     *  - query
     *  - results (opt)
     *  - associationString (opt)
     *  - sort (opt)
     *  - order (opt)
     *  - max (opt)
     *  - offset (opt)
     *  - distinct (opt)
     *
     * Example:
     * http://localhost:8080/search?domainClass=sample.Book&searchTargetField=id&query=1,2,7&results=id,price&max=100&offset=1
     *
     */
    def index() {
        def requiredButNotSupplied = REQUIRED_PARAMS.find {it -> params[it] == null}
        if (requiredButNotSupplied != null) {
          render(["message":"Required api params are not supplied: "+requiredButNotSupplied, "error":404] as JSON)
          return
        }
        def domainClass = grailsApplication.getDomainClass(params.domainClass)
        if (domainClass == null) {
          render(["message":"Domain class not found: "+params.domainClass, "error":404] as JSON)
          return
        }
        def associationString  = (params.associationString) ?: params.searchTargetField

        def result = quickSearchService.search(
          domainClass: domainClass.clazz,
          searchParams: pickUpSearchParams(params),
          searchProperties: [(params.searchTargetField): associationString],
          tokens: [','],
          query: params.query)

        if (params.results) {
          def fields = params.results.split(',')
          respond result.collect { elem ->
            fields.collectEntries{ field ->
              return [field, elem[field]]
            }
          }
          return
        }
        respond result
    }

}
