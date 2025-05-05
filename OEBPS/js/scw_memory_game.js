var SCWMemoryGame = function (card_table_elem) {
    var self = this;
    // true: start with cards face up
    this.startFaceUp = false; 
    // how many ms cards are face up. 0 ms means "always visible. never flip face down"
    this.startFaceDownDelay = 3000; 
    
    // if true, the game star as soon as js loaded
    this.autostart = true;
    this.numOfColumns = 0;
    this.cardTableElement = $(card_table_elem);
    this.cardTable = '#'+this.cardTableElement.attr('id');
    this.cardClass = ".card";
    this.rightCardAnimationClass = "backside-pull-out-back"
    this.flipCardSound = undefined;
    
    this.editorMode = false;
    
    //
    // remove all the selected card from del current deck
    //
    this.removeCardsFromDesk = function () { 
        self.selectedCards().one('animationend webkitAnimationEnd oanimationend msAnimationEnd webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(event) {
            self.selectedCards().addClass('card-correct');
            //self.selectedCards().off('animationend webkitAnimationEnd oanimationend msAnimationEnd webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend');
            self.selectedCards().removeClass(self.rightCardAnimationClass);
            console.log("Animazione finita");
            self.selectedCards().each(function() {
                        console.log("Togli classi");
                        var par = $(this).parent();
                        par.removeClass('increase-z-index');
                        $(this).removeClass('selected');
                        console.log("Classi tolte");
                    });
                    
            //self.selectedCards().removeClass('selected');
            
            if (self.youWin()){
                self.cardTableElement.trigger('OnMemoryGameWin');
            }
        });
        console.log("Sono in Remove Cards");
        self.selectedCards().parent().unbind('click');
        self.selectedCards().addClass(self.rightCardAnimationClass);
        console.log("Finita Remove Cards");        
    }
    
    //
    // check if the current selected cards match
    //
    this.isRightCouple = function () {
        var cards = self.selectedCards();
        var first=$(cards[0]).find('img').attr('src');
        var second=$(cards[1]).find('img').attr('src'); 
        return (first === second);
    }
    
    // 
    // deselect all the current selected card
    //
    this.deselectCards = function () {
        self.selectedCards().each(function() {
            var par = $(this).parent();
            par.removeClass('increase-z-index');
            $(this).removeClass('flip selected');
        });
        //self.selectedCards().removeClass('flip selected');
    }
    
    //
    // returns all the selected cards
    //
    this.selectedCards = function () {
        return $(self.cardTable +' '+ '.card-container.selected');
    }
    
    //
    // return the number of selected cards
    //
    this.numOfSelectedCards = function () {
        return $(self.cardTable +' '+ '.card-container.selected').length;
    }
    
    //
    // return how many cards are still present in the deck
    //
    this.numOfCardsInDeck = function () {
        return ($(self.cardTable +' '+ self.cardClass).length-$(self.cardTable +' .card-correct').length)
    }
    
    //
    // return true if you completed the game
    //
    this.youWin = function() {
        return self.numOfCardsInDeck() == 0;
    }
    
    //
    // select a specific card
    //
    this.selectCard = function(card) {
        if (self.numOfSelectedCards() >= 2) { return false;}
        var crd = $(card).children('.card-container');
        if (crd.hasClass('selected')) {return false;}
        
        self.cardTableElement.trigger('OnMemoryGameSelectAfter',card);
        
        $(card).addClass('increase-z-index');
        crd.addClass('flip selected');
        console.log("Numero carte selezionate: "+self.numOfSelectedCards());
        if (self.numOfSelectedCards() == 2) {
            if (self.isRightCouple()) {
                // disable click on all cards
                self.cardTableElement.trigger('OnMemoryGameMatchBefore',card);
                console.log("Rimuovi carte dal desk");
                setTimeout(self.removeCardsFromDesk,700);
                console.log("Carte rimosse dal desk");
                self.cardTableElement.trigger('MemoryGameMatchAfter',card);
            } else {
                self.cardTableElement.trigger('OnMemoryGameMismatchBefore',card);
                setTimeout(self.deselectCards,700);
                self.cardTableElement.trigger('OnMemoryGameMismatchAfter',card);
            }
        }
        // check if end
        self.cardTableElement.trigger('OnMemoryGameSelectBefore',card);
        return true;
    };
    
    //
    // return a random value
    //
    this.getRandom = function(max) {
        return Math.floor(Math.random() * max); 
    };
    
    
    //
    // game start sequence
    //
    this.start = function(){
        self.cardTableElement.trigger('OnMemoryGameStartBefore');
        
        $(self.cardTable +' .card-correct').removeClass('card-correct');
        
        // start sequence
        if (self.startFaceDownDelay > 0 ) {
            self.setAllCardsFaceUp();
        }
        
        setTimeout(function() {
            self.setAllCardsFaceDown();
            // add click event
            $(self.cardTable +' '+ self.cardClass).each(self._addClickEventOnCard);
            
            self.cardTableElement.trigger('OnMemoryGameStartAfter');
        }, self.startFaceDownDelay);
        
    }
    
    
    // 
    // reset the game (restore the initial state)
    //
    this.reset = function () {   
        self.cardTableElement.trigger('OnMemoryGameResetBefore');
        
        // remove click event
        $(self.cardTable +' '+ self.cardClass).each(function(){$(this).unbind('click');});
        if (self.startFaceUp) {
            self.setAllCardsFaceUp();    
        } else {
            self.setAllCardsFaceDown();
        }
        $(self.cardTable +' .card-correct').removeClass('card-correct');
        self.shuffleDeck();
        
        self.cardTableElement.trigger('OnMemoryGameResetAfter'); 
    }        
    
    //
    // flip the card face up
    //
    this.setCardFaceUp = function(elem) {
        $(elem).addClass('flip');
    }
    
    //
    // flip the card face down
    //
    this.setCardFaceDown = function(elem) {
        $(elem).removeClass('flip');
    }
    
    //
    // flip all cards face up
    //
    this.setAllCardsFaceUp = function() {
        $(self.cardTable +' .card-container').each(function(index, elem){self.setCardFaceUp(elem)});
    }
    
    //
    // flip all cards face down
    //
    this.setAllCardsFaceDown = function() {
        $(self.cardTable +' .card-container').each(function(index, elem){self.setCardFaceDown(elem)});
    }
    
    //
    // this is the default click on card event
    //
    this._addClickEventOnCard = function () {
        $(this).click(function(e){
            e.preventDefault(); 
            if (self.selectCard(this)) {
                if (self.flipCardSound) { 
                    self.flipCardSound.load();
                    self.flipCardSound.play(); 
                }
                self.cardTableElement.trigger('OnMemoryGameCardClick',this);
            }
        });
    }
  
    //
    // shuffle cards randomly and dispose on the gameboard
    //
    this.shuffleDeck = function() {
        allElements = $(self.cardTable +' '+ self.cardClass).get();
        var shuffled = $.map(allElements, function(){
            var random = self.getRandom(allElements.length);
            randomElement = $(allElements[random]).clone(true)[0];
            allElements.splice(random, 1);
            return randomElement;
        });
        
        $(self.cardTable +' '+ self.cardClass).each(function(i){
            $(this).replaceWith($(shuffled[i]));
        });
        
        // fix num of columns
        if (self.numOfColumns > 0) {
            $(self.cardTable +' '+ self.cardClass).each(function(index,elem){
                if (index % self.numOfColumns == self.numOfColumns-1 ) {
                    $('<div class="clearfix"></div>').insertAfter($(elem));
                }
            });
        }
        $(self.cardTable).append('<div class="clearfix"></div>');
        
    }
    
    //
    // initialize the game object
    //
    this.init = function (editorMode) {
        if (editorMode !== undefined ){
            self.editorMode = editorMode;
        }
        
        self.cardTableElement.trigger('OnMemoryGameInitBefore');
        
        // retrive configuration data from the HTML element
        if (self.cardTableElement.data('card-class') !== undefined && self.cardTableElement.data('card-class') !== "") {
            self.cardClass = "."+self.cardTableElement.data('card-class');
        }
        //console.log('cardClass: '+self.cardClass);
        
        if (self.cardTableElement.data('right-card-animation-class') !== undefined && self.cardTableElement.data('right-card-animation-class') !== "") {
            self.rightCardAnimationClass = "."+self.cardTableElement.data('right-card-animation-class');
        }
        
        if (self.cardTableElement.data('num-of-columns') !== undefined && self.cardTableElement.data('num-of-columns') !== "") {
            self.numOfColumns = parseInt(self.cardTableElement.data('num-of-columns'));
        }
        //console.log('numOfColumns: '+self.numOfColumns);
        
        if (self.cardTableElement.data('start-face-up') !== undefined && self.cardTableElement.data('start-face-up') !== "") {
            self.startFaceUp = self.cardTableElement.data('start-face-up');
        }
        //console.log('startFaceUp: '+self.startFaceUp);
        
        if (self.cardTableElement.data('start-face-down-delay') !== undefined && self.cardTableElement.data('start-face-down-delay') !== "") {
            self.startFaceDownDelay = parseFloat(self.cardTableElement.data('start-face-down-delay'))*1000;
        }
        //console.log('startFaceDownDelay: '+self.startFaceDownDelay);
        
        if (self.cardTableElement.data('autostart') !== undefined && self.cardTableElement.data('autostart') !== "") {
            self.autostart = self.cardTableElement.data('autostart');
        }
        //console.log('autostart: '+self.autostart);
        
        if (self.cardTableElement.data('flip-card-sound-id') !== undefined && self.cardTableElement.data('flip-card-sound-id') !== "") {
            var soundId = self.cardTableElement.data('flip-card-sound-id');
            self.flipCardSound = $('#'+soundId).get(0);
        }
        
        var allElements = $(self.cardTable +' '+ self.cardClass).get();
        $(self.cardTable +' '+ self.cardClass).each(function(i){
            var elem = $(this).clone(true).appendTo(self.cardTable);
        });
        
        self.cardTableElement.trigger('OnMemoryGameInitAfter');
        self.reset();
        
        // Patch: use setTimeout to force show() afte init
        setTimeout(function(){ self.cardTableElement.show()}, 1);
        
        
        if (self.autostart && !self.editorMode) {
            self.start();
        }
    }

}
