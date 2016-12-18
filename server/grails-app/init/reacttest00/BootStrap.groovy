package reacttest00
import sample.*

class BootStrap {

    def init = { servletContext ->
    /*
        (1..100).each {
             new Book(title: 'title'+it, price: 100+it).save()
             new Author(name: 'name'+it, age: 200+it).save()
        }
        */
    }
    def destroy = {
    }
}
