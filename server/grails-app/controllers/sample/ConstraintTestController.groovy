package sample

import static org.springframework.http.HttpStatus.*
import grails.transaction.Transactional

@Transactional(readOnly = true)
class ConstraintTestController {

    static responseFormats = ['json', 'xml']
    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

    def index(Integer max) {
        params.max = Math.min(max ?: 10, 100)
        respond ConstraintTest.list(params), model:[constraintTestCount: ConstraintTest.count()]
    }

    def show(ConstraintTest constraintTest) {
        respond constraintTest
    }

    @Transactional
    def save(ConstraintTest constraintTest) {
        if (constraintTest == null) {
            transactionStatus.setRollbackOnly()
            render status: NOT_FOUND
            return
        }

        if (constraintTest.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond constraintTest.errors, view:'create'
            return
        }

        constraintTest.save flush:true

        respond constraintTest, [status: CREATED, view:"show"]
    }

    @Transactional
    def update(ConstraintTest constraintTest) {
        if (constraintTest == null) {
            transactionStatus.setRollbackOnly()
            render status: NOT_FOUND
            return
        }

        if (constraintTest.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond constraintTest.errors, view:'edit'
            return
        }

        constraintTest.save flush:true

        respond constraintTest, [status: OK, view:"show"]
    }

    @Transactional
    def delete(ConstraintTest constraintTest) {

        if (constraintTest == null) {
            transactionStatus.setRollbackOnly()
            render status: NOT_FOUND
            return
        }

        constraintTest.delete flush:true

        render status: NO_CONTENT
    }
}
