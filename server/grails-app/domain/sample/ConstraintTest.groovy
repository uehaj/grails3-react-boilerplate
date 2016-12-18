package sample

class ConstraintTest {
  String string_blank_true
  String string_blank_false
  String string_email
  String string_inList
  Integer number_inList
  String string_matches
  Integer number_min_10
  Integer number_max_20
  Integer number_range_10_20
  String string_minSize_10
  String string_maxSize_20
  String string_size_10_20
  String string_url

  static constraints = {
    string_blank_true blank: true
    string_blank_false blank: false
    string_email email: true
    string_inList inList: ["a","b","c"]
    number_inList inList: [1,2,3]
    string_matches matches: '[A-Z][a-z]*'
    number_min_10 min: 10
    number_max_20 max: 20
    number_range_10_20 range: 10..20
    string_minSize_10 minSize: 10
    string_maxSize_20 maxSize: 20
    string_size_10_20 size: 10..20
    string_url url: true
  }
}
