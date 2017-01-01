package reacttest00
import sample.*

class BootStrap {

    def init = { servletContext ->
        (1..30).each {
             def b = new Book(title: 'title'+it, price: 100+it).save()
             println b
             def a = new Author(name: 'name'+it, age: 200+it, email: "mail$it@example.com", schedules:[]).save()
             println a
             def s = new Schedule(date:new Date(), name:'name'+it, author: a).save()
             println s
        }
    }
    def destroy = {
    }
}
