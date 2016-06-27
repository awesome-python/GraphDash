(function() {
  var getParameterByName,
    __slice = [].slice;

  getParameterByName = function(name) {
    var regex, results;
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
    results = regex.exec(location.search);
    if (results === null) {
      return "";
    } else {
      return decodeURIComponent(results[1].replace(/\+/g, " "));
    }
  };

  if (typeof String.prototype.trim === 'undefined') {
    String.prototype.trim = function() {
      return String(this).replace(/^\s+|\s+$/g, '');
    };
  }

  $(document).ready(function() {
    var params, spaces, template;
    $.widget("ui.autocomplete", $.ui.autocomplete, {
      options: {
        maxItems: 9999
      },
      _renderMenu: function(ul, items) {
        var count, that;
        that = this;
        count = 0;
        $.each(items, function(index, item) {
          if (count < that.options.maxItems) {
            that._renderItemData(ul, item);
          }
          count++;
        });
      }
    });
    window.onpopstate = function(event) {
      var href, origin;
      if (event) {
        href = window.location.href.slice(0, -1);
        origin = window.location.origin;
        if ((href === origin) || window.location.search) {
          location.reload();
        }
      }
    };
    Handlebars.registerHelper("withObj", function(context, options) {
      return options.fn(context[options.hash.key]);
    });
    Handlebars.registerHelper('uri', function(context) {
      return encodeURI(context);
    });
    Handlebars.registerHelper("generate_parents", function(context, options) {
      var families, i, ret, up_url, _i, _ref;
      if (context) {
        families = context.split('/');
        ret = '';
        for (i = _i = 0, _ref = families.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
          up_url = families.slice(0, +i + 1 || 9e9).join('/');
          ret += options.fn({
            up_url: up_url,
            up_name: options.hash.aliases[up_url]
          });
        }
        return ret;
      }
    });
    template = Handlebars.compile($("#response-template").html());
    $('#box').on('input', function() {
      return $(this).addClass('notsubmitted');
    });
    $("#form").submit(function(event) {
      var keywords;
      $('#box').removeClass('notsubmitted');
      $('#box').blur().focus();
      keywords = encodeURIComponent($("#box").val().trim());
      $.ajax({
        url: URL_SEARCH,
        type: "get",
        data: "value=" + keywords
      }).done(function(response, textStatus, jqXHR) {
        response.url = URL_FAMILY;
        $("#response").html(template(response));
        history.pushState({}, "Title", URL_FAMILY + "?search=" + keywords);
      });
      return false;
    });
    $("#clearbutton").click(function() {
      $("#response").html("");
      $('#box').removeClass('notsubmitted');
      $("#box").val("");
      history.pushState({}, "Title", "/");
    });
    $("#searchbutton").click(function() {
      $("#form").submit();
    });
    spaces = RegExp(' \\s*');
    $.ajax({
      url: URL_TAGS,
      type: "get"
    }).done(function(response, textStatus, jqXHR) {
      var t, tags;
      tags = __slice.call(response.tags).concat(__slice.call((function() {
          var _i, _len, _ref, _results;
          _ref = response.tags;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            t = _ref[_i];
            _results.push('-' + t);
          }
          return _results;
        })()));
      $("#box").autocomplete({
        minLength: 0,
        maxItems: 20,
        focus: function(request, ui) {
          var terms;
          terms = this.value.split(spaces);
          terms.pop();
          terms.push(ui.item.value);
          this.value = terms.join(" ");
          return false;
        },
        source: function(request, resp) {
          return resp($.ui.autocomplete.filter(tags, request.term.split(spaces).pop()));
        },
        select: function(event, ui) {
          this.value = this.value + ' ';
          $("#form").submit();
          return false;
        }
      });
    });
    $("input:text, textarea").each(function() {
      var $this;
      $this = $(this);
      $this.data("placeholder", $this.attr("placeholder")).focus(function() {
        $this.removeAttr("placeholder");
      }).blur(function() {
        $this.attr("placeholder", $this.data("placeholder"));
      });
    });
    params = getParameterByName("search");
    if (params !== "") {
      $("#box").val(params);
      $("#form").submit();
    }
  });

}).call(this);

//# sourceMappingURL=index.js.map
