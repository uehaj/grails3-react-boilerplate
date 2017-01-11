package reacttest00

import grails.core.GrailsApplication

import sample.Book

class SearchController {

    GrailsApplication grailsApplication

    def quickSearchService

    static responseFormats = ['json']

    def index() {
        def domainClass = grailsApplication.getDomainClass(params.domainClassName)
        def result = quickSearchService.search(
          domainClass: Book,
          searchParams: [:],
          searchProperties: [id: "id"],
          tokens: [','],
          query: params.ids)

        if (params.fields) {
          def fields = params.fields.split(',')
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
