package reacttest00
import sample.Book

class BootStrap {

    def init = { servletContext ->
        (1..100).each {
             new Book(title: 'title'+it, price: 100+it).save()
        }
    }
    def destroy = {
    }
}
