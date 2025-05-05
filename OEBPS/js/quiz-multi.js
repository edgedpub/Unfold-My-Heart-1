SCQuiz = function(selector, options) {
  var self = this;
  self.element = $(selector);
  self.objectID = $(selector).attr("id");
  self.isRTL = false;
  self._readonly = false;
  self.default = {
    assessmentID: $(selector).attr("id"),
    quiz: [],
    uncompletedMessage: 'Missing Answers!',
    perfectMessage: 'Perfect!',
    countdown: false,
    save: false,
  };
  self.options = $.extend({}, self.default, options);
  self._autoinit = ($(selector).attr("data-autoinit") !== "false");
  if (self._autoinit !== true) console.log("quiz autoinit:", self._autoinit);

  self.element.on(PubCoder.Events.Show, function(e) {
    self.element.trigger('SCQuizReady');
  });


  self.init = function() {
    self._localStorageKey = pubcoder.project.id + "-" + self.options.assessmentID;

    try {
      if ((getComputedStyle($('' + selector)[0]).direction).toLowerCase() == "rtl") {
        self.isRTL = true;
      }
    } catch (err) {
      console.error(err);
    }

    // eventually re-arrange quiz basing on options or saved status
    var originalQuiz = self.options.quiz;
    var savedData = self.load();
    var savedDataWasRestored = false;
    if (self.options.autosave && savedData !== false) {
      try {
        var pickedItems = [];
        _(savedData.questions.forEach(function (savedItem) {
          var q = _(self.options.quiz).find(function (item) { return item.question == savedItem.question; })
          if (q != null) {
            pickedItems.push(q);
            _(savedItem.answers).forEach(function (savedChoice) {
              $("input#" + savedChoice.choice, self.element)[0].checked = savedChoice.value;
            });
          }
        }));
        self.options.quiz = pickedItems; 
        savedDataWasRestored = true;       
      } catch (error) {
        console.error("CORRUPTED SAVED DATA!! QUIZ CHANGED AFTER SAVE??");
      }
    }
    if (!savedDataWasRestored) {
      if (self.options.mode == "ask-random") {
        self.options.quiz = _(self.options.quiz).sample(self.options.numberOfQuestionsToAsk);
      } else if (self.isRTL) {
        self.options.quiz.reverse();
      }
    }

    // re-arrange quiz on DOM accordingly
    if (self.options.quiz != originalQuiz) {
      console.log("re-arringing quiz...");
      var container = document.getElementsByClassName("practicelist")[0];
      var elements = Array.prototype.slice.call(container.getElementsByClassName('swiper-slide'));
      $(container).empty();
      _(self.options.quiz).forEach(function(item) {
        var element = _(elements).find(function(el) { return $(el).attr("id") == item.question; });
        if (element != null) container.appendChild(element);
      });
    }

    if (self.isRTL) {
      self.fixRTL(self, selector);
    }

    if ($('.multiple-choice-problem', self.element).length > 1) {
      window.slider = self.mySwiper = new Swiper23(selector + ' .swiper-container', {
        slideElement: 'li',
        onFirstInit: function() {
          $('.practicediv > header h1', self.element).append("<span class='counter'>(1/" + self.options.quiz.length + ")</span>");
        },
        onInit: function() {
          if (self.isRTL) {
            $(selector).hide();
            try {
              self.mySwiper.swipeTo(parseInt(self.mySwiper.slides.length) - 1);
            } catch (err) {
              console.error(err);
            }
            $(selector).show();
          }
        },
        onSlideChangeStart: function() {
          $(selector + ' .arrow-left').css("display", "none");
          $(selector + ' .arrow-right').css("display", "none");
          return true;
        },
        onSlideChangeEnd: function() {
          // console.log(self.hasBeenReset);
          self._checkArrows();
          if (!self.hasBeenReset) {
            // trigger pubcoder events
            // console.log("events should be triggered");
            if (!self.isRTL) {
              if (self.mySwiper.previousIndex != null && self.mySwiper.previousIndex < self.mySwiper.activeIndex) {
                self.element.trigger('SCQuizPageNext');
              } else if (self.mySwiper.previousIndex != null && self.mySwiper.previousIndex > self.mySwiper.activeIndex) {
                self.element.trigger('SCQuizPagePrevious');
              }
            } else {
              if (self.mySwiper.previousIndex != null && self.mySwiper.previousIndex > self.mySwiper.activeIndex) {
                self.element.trigger('SCQuizPageNext');
              } else if (self.mySwiper.previousIndex != null && self.mySwiper.previousIndex < self.mySwiper.activeIndex) {
                self.element.trigger('SCQuizPagePrevious');
              }
            }
          } else {
            self.hasBeenReset = false;
          }
          if (!self.isRTL) {
            if (self.mySwiper.activeIndex != self.mySwiper.slides.length - 1) {
              $('.practicediv > header .counter', self.element).html("(" + (self.mySwiper.activeIndex + 1) + "/" + (self.mySwiper.slides.length - 1) + ")");
            } else {
              $('.practicediv > header .counter', self.element).html("");
            }
          } else {
            if (self.mySwiper.activeIndex != 0) {
              var currNumber = self.mySwiper.slides.length - self.mySwiper.activeIndex;
              $('.practicediv > header .counter', self.element).html("(" + (currNumber) + "/" + (self.mySwiper.slides.length - 1) + ")");
            } else {
              $('.practicediv > header .counter', self.element).html("");
            }
          }
        }
      });

      var $buttons = $(selector + " .quiz-buttons");
      $buttons.remove();
      var checkSlide = self.mySwiper.createSlide();
      checkSlide.html(
        $buttons
        .clone().wrap("<div></div>")
        .parent()
        .append("<div class='conteggio-finale'></div>")
        .append("<div class='messaggio-finale'></div>")
        .html()
      );
      $(checkSlide).addClass("multiple-choice-problem summary");
      if (self.isRTL) {
        try {
          checkSlide.prepend();
        } catch (err) {
          // console.log(err);
        }
      } else {
        checkSlide.append();
      }
      $(selector + " .quiz-buttons").show();

      $(selector + ' .arrow-left').on("click", function(e) {
        e.stopPropagation();
        e.preventDefault();
        self.mySwiper.swipePrev();
      });
      $(selector + ' .arrow-right').on("click", function(e) {
        e.stopPropagation();
        e.preventDefault();
        self.mySwiper.swipeNext();
      })
      self._checkArrows = function() {
        if (self.mySwiper.activeIndex == 0)
          $(selector + ' .arrow-left').css("display", "none");
        else
          $(selector + ' .arrow-left').fadeIn(100);
        if (self.mySwiper.activeIndex == self.mySwiper.slides.length - 1)
          $(selector + ' .arrow-right').css("display", "none");
        else
          $(selector + ' .arrow-right').fadeIn(100);
      }
      self._checkArrows();
    } else {
      $(selector + ' .arrow-left').remove();
      $(selector + ' .arrow-right').remove();
      $('.quiz-buttons', self.element).css("paddingTop", 0).show();
    }

    $('.multiple-choice-problem', self.element).css("visibility", "visible");

    if (self.isRTL) {
      self.fixRTLAfterInit(self, selector);
    }
    
    $('.practicelist .multiple-choice-problem .choices .choice-content', self.element).each(function() {
      var _fs = $(this).css("font-size").replace("px", "");

    });

    $('.quiz_reset', self.element).on(window.touchDownEvent, function(event) {
      if (self.options.enableReset) {
        setTimeout(function() {
          self.resetQuiz();
        }, 100);
      }
      return false;
    });

    $('input[type=checkbox], input[type=radio]', self.element).change(function() {
      // console.log("changed");
      if (self.options.autosave) self.save();
      $('.messaggio-finale', self.element).hide();
      $('.practicelist .multiple-choice-problem .quiz-choice-right', self.element).removeClass("quiz-choice-right");
      $('.practicelist .multiple-choice-problem .quiz-choice-wrong', self.element).removeClass("quiz-choice-wrong");
      $('.practicelist .multiple-choice-problem .quiz-choice-missed', self.element).removeClass("quiz-choice-missed");
      $('.conteggio-finale', self.element).empty().hide();
      self.element.trigger('SCQuizAnswerChanged');
    });

    $('.quiz_check', self.element).on(window.touchDownEvent, function(event) {
      event.preventDefault();
      self.check(true);
    });

    if (savedDataWasRestored && savedData.checked) self.check();

    if (!self._readonly) $(".quiz_check").css("display", "inline");
    if (self.options.enableReset) $(".quiz_reset").css("display", "inline");

    $('label', self.element).on("mousedown", function(e) {
      // prevent dragging pages starting from labels on desktop, which would also check the item
      e.stopPropagation();
    });

    $('label', self.element).on("click", function(e) {
      // console.log("choice clicked");
      
      e.preventDefault();
      e.stopPropagation();
  
      if (self._readonly) return false;
  
      var checkID = "#" + $(this).attr("for");
      if ($(checkID).attr("type") == "radio") {
        $(checkID).prop("checked", true);
      } else {
        $(checkID).prop("checked", (!$(checkID).prop("checked")));
      }
      $(checkID).trigger("change");
    });
  };


  


  self.lockQuiz = function() {
    this._readonly = true;
    $("input, label, button", self.element).attr("disabled", "disabled");
  };


  self.resetQuiz = function() {
    $('.conteggio-finale', self.element).empty();
    $('.messaggio-finale > p', self.element).empty();
    $('.messaggio-finale', self.element).empty();
    $('.messaggio-finale', self.element).hide();
    self.hasBeenReset = true;
    self._readonly = false;
    setTimeout(function() {
      $('.practicelist .multiple-choice-problem li', self.element).removeClass("quiz-choice-right").removeClass("quiz-choice-wrong").removeClass("quiz-choice-missed");
    }, 100);
    $('.practicelist .multiple-choice-problem li', self.element).removeClass("quiz-choice-right").removeClass("quiz-choice-wrong").removeClass("quiz-choice-missed");
    $("button, input", self.element).removeAttr("disabled");
    $("button, input:checked", self.element).removeAttr("checked");
    if (self.mySwiper) {
      if (self.isRTL) {
        self.mySwiper.swipeTo((self.mySwiper.slides.length) - 1, 200);
        setTimeout(function() {
          self._checkArrows();
        }, 10);
      } else {
        self.mySwiper.reInit();
        self.mySwiper.swipeTo(0, 200);
      }
    }

    if (self.options.autosave) {
      localStorage.removeItem(self._localStorageKey);
      self.save();
    }

    $(self).trigger('SCQuizReset'); // trigger reset event on controller
    self.element.trigger('SCQuizReset'); // trigger reset event on element
  };


  self.save = function(isChecked) {
    isChecked = (isChecked === true);

    if (!localStorage) return;

    var score = 0;
    var questionsAnsweredCorrectly = $(".practicelist .quiz-question-right", self.element).length;
    if (self.options.quiz.length > 0) {
      score = questionsAnsweredCorrectly / self.options.quiz.length;
      score = parseFloat(score.toFixed(4));
    }

    data = {
      timestamp: (new Date()).getTime(),
      readonly: self._readonly,
      checked: isChecked,
      score: score,
      correct: questionsAnsweredCorrectly,
      questions: []
    };

    $('.practicelist .multiple-choice-problem:not(.summary)', self.element).each(function(questionIndex, questionElement) {
      var savedQuestion = {
        question : $(questionElement).attr("id"),
        answers : []
      };
      var $answerElements = $("input", $(questionElement));
      $answerElements.each(function(answerIndex, answerElement) {
        var userChoice = $(answerElement).is(":checked");
        var savedChoice = {
          choice : $(answerElement).attr("id"),
          value : userChoice
        };
        savedQuestion.answers.push(savedChoice);
      });
      data.questions.push(savedQuestion);
    });

    localStorage.setItem(self._localStorageKey, JSON.stringify(data));
    // console.log("saved quiz " + self._localStorageKey, data);
  };


  self.load = function() {
    if (!localStorage) return false;

    data = localStorage.getItem(self._localStorageKey);
    if (data == null) return false;
    data = JSON.parse(data);
    if (data == null) {
      // console.log("invalid localStorage data for quiz " + self._localStorageKey);
      return false;
    }

    return data;
  }


  self.check = function(isUserAction) {
    // console.log("checking");
    if (!self.options.enableReset) {
      self.lockQuiz();
    }

    $('.messaggio-finale', self.element).hide();
    $('.practicelist .multiple-choice-problem .quiz-choice-right', self.element)
      .removeClass("quiz-choice-right");
    $('.practicelist .multiple-choice-problem .quiz-choice-wrong', self.element)
      .removeClass("quiz-choice-wrong");
    $('.practicelist .multiple-choice-problem .quiz-choice-missed', self.element)
      .removeClass("quiz-choice-missed");

    $('.conteggio-finale', self.element).empty();
    $('.messaggio-finale > p', self.element).empty();
    $('.messaggio-finale', self.element).empty();
    $('.messaggio-finale', self.element).hide();

    $('.practicelist .multiple-choice-problem:not(.summary)', self.element).each(function(num_domanda, domanda) {
      $(domanda).removeClass("quiz-question-right");
      $(domanda).removeClass("quiz-question-missed");
      $(domanda).removeClass("quiz-question-wrong");
      var $risposte = $("input", $(domanda));
      var tentativi = [];
      var stato = 'missed';
      $risposte.each(function(num_risposta, risposta) {
        var tentativo = $(risposta).is(":checked");// / 1;
        // var giusta = self.options.risposte[num_domanda][num_risposta];
        var quizItem = _(self.options.quiz).find(function(item) { return item.question == $(domanda).attr("id")});
        var giusta = _(quizItem.answers).find(function(item) { return item.choice == $(risposta).attr("id")}).correct;

        if (tentativo && tentativo === giusta)
          $(risposta).parent().addClass("quiz-choice-right");
        if (tentativo && tentativo !== giusta)
          $(risposta).parent().addClass("quiz-choice-wrong");
        if (!tentativo && giusta)
          $(risposta).parent().addClass("quiz-choice-missed");
      });
      if ($("li", $(domanda)).filter(".quiz-choice-wrong").length > 0)
        stato = 'wrong';
      else if ($("li", $(domanda)).filter(".quiz-choice-right").length > 0 && $("li", $(domanda)).filter(".quiz-choice-missed").length > 0)
        stato = 'wrong';
      else if ($("li", $(domanda)).filter(".quiz-choice-right").length > 0)
        stato = 'right';
      $(domanda).addClass("quiz-question-" + stato);
    });

    if (!self.isRTL) {
      $('.conteggio-finale', self.element)
        .empty()
        .append("<div class='finale-quiz finale-quiz-choice-right'></div><span>" + $(".quiz-question-right", self.element).length + "</span>")
        .append("<div class='finale-quiz finale-quiz-choice-wrong'></div><span>" + $(".quiz-question-wrong", self.element).length + "</span>")
        .append("<div class='finale-quiz finale-quiz-choice-missed'></div><span>" + $(".quiz-question-missed", self.element).length + "</span>")
        .show();
    } else {
      $('.conteggio-finale', self.element)
        .empty()
        .append("<span>" + $(".quiz-question-right", self.element).length + "</span><div class='finale-quiz finale-quiz-choice-right'></div>")
        .append("<span>" + $(".quiz-question-wrong", self.element).length + "</span><div class='finale-quiz finale-quiz-choice-wrong'></div>")
        .append("<span>" + $(".quiz-question-missed", self.element).length + "</span><div class='finale-quiz finale-quiz-choice-missed'></div>");
      self.fixFinalSummaryRTL(selector);
      $('.conteggio-finale', self.element).show();
    }

    var eventToTrigger = null;
    if ($(".quiz-question-right", self.element).length !== self.options.quiz.length) {
      if ($(".quiz-question-missed", self.element).length > 0) {
        $('.messaggio-finale', self.element).append("<p></p>").html();
        $('.messaggio-finale > p', self.element).html(self.options.uncompletedMessage);
        $('.messaggio-finale', self.element).show();
        eventToTrigger = "SCQuizCompletedMissingAnswers";
      } else {
        eventToTrigger = "SCQuizCompletedSomeWrongAnswers";
      }
    } else {
      $('.messaggio-finale', self.element).append("<p></p>").html();
      $('.messaggio-finale > p', self.element).html(self.options.perfectMessage);
      $('.messaggio-finale', self.element).show();
      eventToTrigger = "SCQuizCompletedAllCorrectAnswers";
    }

    if (!self.options.showMissed) {
      $(".quiz-choice-missed", self.element).removeClass("quiz-choice-missed");
    }

    if (isUserAction === true) {
      if (self.options.autosave) self.save(true);
      $(self).trigger("SCQuizCompleted"); // generic completed event (triggered on controller)
      self.element.trigger("SCQuizCompleted"); // generic completed event (triggered on element)
      self.element.trigger(eventToTrigger); // specific completed-with-state event
    }
  }

  self.fixRTL = function(obj, selector) {
    try {
      // reverse swiper slides order
      $(selector + ' .practicediv.swiper-container > ol.practicelist.swiper-wrapper').attr('dir', 'rtl');
      $(selector + ' .practicediv.swiper-container > ol.practicelist.swiper-wrapper').children().each(
        function(i, c) {
          $(c).attr('dir', 'rtl');
          // $(selector + ' .practicediv.swiper-container > ol.practicelist.swiper-wrapper').prepend(c);
        });
    } catch (err) {
      console.error(err);
    }
    try {
      // move checkbox images (background) to be right-aligned
      $('div' + selector + ' input.css-checkbox + label.css-label').appendValueToStyleAttribute('background-position: right 3px !important');
    } catch (err) {
      console.error(err);
    }
    try {
      // move label to the left 
      var bgSize = parseInt($('div' + selector + ' input.css-checkbox + label.css-label').css('background-size'));
      $('div' + selector + ' .practicediv .choices .choice-content').css('margin-right', (bgSize + 10) + 'px');
    } catch (err) {
      console.error(err);
    }

    try {
      // reverse answers
      obj.options.risposte.reverse();
    } catch (err) {
      console.error(err);
    }
  }

  self.fixRTLAfterInit =  function(obj, selector) {
    try {
      $(selector + ' .title').children().each(function(i, c) {
        if ($(c).hasClass('label')) $(c).hide();
        $(selector + ' .title').prepend(c);
      });
    } catch (err) {
      console.log(err);
    }
    try {
      $(selector).appendValueToStyleAttribute('text-align:right !important');
    } catch (err) {
      console.error(err);
    }
    try {
      if (typeof obj.mySwiper == 'undefined') {
        $(selector + ' .practice .practicediv.swiper-container .practicelist.swiper-wrapper .swiper-slide').appendValueToStyleAttribute('float:right !important');
      }
    } catch (err) {
      console.error(err);
    }
  }

  self.fixFinalSummaryRTL = function(selector) {
    try {
      // fix text positioning
      var childrenValues = $('div' + selector + ' .finale-quiz');
      childrenValues.each(function(i) {
        if (parseInt(i) < (childrenValues.length - 1)) {
          $(this).appendValueToStyleAttribute('margin-left:20px !important');
        } else {
          $(this).appendValueToStyleAttribute('margin-left:2px !important');
        }
      });
    } catch (err) {
      console.error(err);
    }
  }

  if (self._autoinit) self.init();

  return self;
};



$.fn.appendValueToStyleAttribute = function(value) {
  try {
    var element = $(this);
    var tempVal = element.attr('style');
    if (typeof tempVal == 'undefined') {
      tempVal = '';
    }
    if (tempVal.length === 0 || !tempVal.trim()) {
      tempVal = value + ';';
    } else {
      if (tempVal.indexOf(value) > -1) return;
      tempVal += ' ;' + value + ';';
    }
    element.attr('style', tempVal);
  } catch (err) {
    console.error(err);
  }
}