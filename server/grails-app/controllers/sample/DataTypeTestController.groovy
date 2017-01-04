package sample

import static org.springframework.http.HttpStatus.*
import grails.transaction.Transactional

@Transactional(readOnly = true)
class DataTypeTestController {

    static responseFormats = ['json', 'xml']
    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

    def index(Integer max) {
        params.max = Math.min(max ?: 10, 100)
        respond DataTypeTest.list(params), model:[dataTypeTestCount: DataTypeTest.count()]
    }

    def show(DataTypeTest dataTypeTest) {
        respond dataTypeTest
    }

    @Transactional
    def save(DataTypeTest dataTypeTest) {
        if (dataTypeTest == null) {
            transactionStatus.setRollbackOnly()
            render status: NOT_FOUND
            return
        }

        if (dataTypeTest.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond dataTypeTest.errors, view:'create'
            return
        }

        dataTypeTest.save flush:true

        respond dataTypeTest, [status: CREATED, view:"show"]
    }

    @Transactional
    def update(DataTypeTest dataTypeTest) {
        if (dataTypeTest == null) {
            transactionStatus.setRollbackOnly()
            render status: NOT_FOUND
            return
        }

        if (dataTypeTest.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond dataTypeTest.errors, view:'edit'
            return
        }

        dataTypeTest.save flush:true

        respond dataTypeTest, [status: OK, view:"show"]
    }

    @Transactional
    def delete(DataTypeTest dataTypeTest) {

        if (dataTypeTest == null) {
            transactionStatus.setRollbackOnly()
            render status: NOT_FOUND
            return
        }

        dataTypeTest.delete flush:true

        render status: NO_CONTENT
    }
}
