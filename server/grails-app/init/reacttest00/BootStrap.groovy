package reacttest00
import sample.*

class BootStrap {

    private validateAndSave(d){
      d.validate()
      if (d.hasErrors()) {
        d.errors.allErrors.each {
          println it
        }
      }
      if (d.save() == null) {
        println "save failed:"+d
      }
    }

    def init = { servletContext ->
        (1..30).each {
             def b = new Book(title: 'title'+it, price: 100+it).save()
             def a = new Author(name: 'name'+it,
                                age: 200+it,
                                email: "mail$it@example.com",
                                todaySchedule: null,
                                schedules:[]).save()
             def s = new Schedule(date:new Date(), name:'name'+it, author: a).save()
             def d = new DataTypeTest(stringValue: "a"+(30)-it,
                                      booleanValue: it % 2 == 0,
                                      integerValue: 3+it,
                                      doubleValue: 4.3+it,
                                      floatValue: 5.3+it,
                                      shortValue: 6+it,
                                      characterValue: "b",
                                      byteValue: 7+it,
                                      dateValue: new Date(),

                                      booleanValuePrim: it % 2 == 1,
                                      integerValuePrim: 8-it,
                                      doubleValuePrim: 9.4-it,
                                      floatValuePrim: 10.4-it,
                                      shortValuePrim: 11-it,
                                      charValuePrim: "c",
                                      byteValuePrim: 12-it,
                                     )
             validateAndSave(b)
             validateAndSave(a)
             validateAndSave(s)
             validateAndSave(d)
        }
    }
    def destroy = {
    }
}
