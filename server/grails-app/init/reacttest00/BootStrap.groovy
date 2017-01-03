package reacttest00
import sample.*

class BootStrap {

    def init = { servletContext ->
        (1..30).each {
             def b = new Book(title: 'title'+it, price: 100+it).save()
             def a = new Author(name: 'name'+it,
                                age: 200+it,
                                email: "mail$it@example.com",
                                todaySchedule: null,
                                schedules:[]).save()
             def s = new Schedule(date:new Date(), name:'name'+it, author: a).save()
        }
    }
    def destroy = {
    }
}
