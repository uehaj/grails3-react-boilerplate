package sample

import static org.springframework.http.HttpStatus.*
import grails.transaction.Transactional

@Transactional(readOnly = true)
class ScheduleController {

    static responseFormats = ['json', 'xml']
    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

    def index(Integer max) {
        params.max = Math.min(max ?: 10, 100)
        respond Schedule.list(params), model:[scheduleCount: Schedule.count()]
    }

    def show(Schedule schedule) {
        respond schedule
    }

    @Transactional
    def save(Schedule schedule) {
        if (schedule == null) {
            transactionStatus.setRollbackOnly()
            render status: NOT_FOUND
            return
        }

        if (schedule.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond schedule.errors, view:'create'
            return
        }

        schedule.save flush:true

        respond schedule, [status: CREATED, view:"show"]
    }

    @Transactional
    def update(Schedule schedule) {
        if (schedule == null) {
            transactionStatus.setRollbackOnly()
            render status: NOT_FOUND
            return
        }

        if (schedule.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond schedule.errors, view:'edit'
            return
        }

        schedule.save flush:true

        respond schedule, [status: OK, view:"show"]
    }

    @Transactional
    def delete(Schedule schedule) {

        if (schedule == null) {
            transactionStatus.setRollbackOnly()
            render status: NOT_FOUND
            return
        }

        schedule.delete flush:true

        render status: NO_CONTENT
    }
}
