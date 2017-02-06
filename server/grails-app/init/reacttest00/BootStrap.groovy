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
        println "save failed: "+d
      }
    }

    def init = { servletContext ->
        (1..30).each {
             def b = new Book(title: 'title'+it, price: 100+it).save()
             def s = new Schedule(date:new Date(), name:'name'+it)
             def a = new Author(name: 'name'+it,
                                age: 200+it,
                                email: "mail$it@example.com",
                                todaySchedule: s,
                                schedules:[])
             s.author = a
             a.save()
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
             def c = new ConstraintTest(
                 string_blank_true: "aaa",
                 string_blank_false: "aaa",
                 string_email: "hoge@a.b.c.jp",
                 string_inList: "a",
                 number_inList: 3,
                 string_matches: "Aa",
                 number_min_10: 10,
                 number_max_20: 20,
                 number_range_10_20: 10,
                 string_minSize_10: "aaaaaaaaaa",
                 string_maxSize_20: "aaaaaaaaaa",
                 string_size_10_20: "aaaaaaaaaa",
                 string_url: "http://hoge.a.b.c.jp/",
                 string_display_false: "aaa",
                 string_editable_false: "aaa",
                 date_format_xxx: new Date("2017/01/01 00:00:00"),
                 string_password_true: "aaa",
                 string_widget_textarea: "aaa",
             );

             validateAndSave(b)
             validateAndSave(a)
             validateAndSave(s)
             validateAndSave(d)
             validateAndSave(c)
        }
    }
    def destroy = {
    }
}
