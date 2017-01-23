    $(document).ready(function(){
        // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
        $('.modal-trigger').leanModal({
            dismissible: true, // Modal can be dismissed by clicking outside of the modal
            opacity: .5, // Opacity of modal background
            in_duration: 300, // Transition in duration
            out_duration: 200, // Transition out duration
            ready: function() {  }, // Callback for Modal open
            complete: function() {  } // Callback for Modal close
        });

        $('.overlay').delay(1000).fadeOut(1000);

        $('.parallax').parallax();
    });

    function SeatReservation(name, initialMeal, note) {
        var self = this;
        self.name = ko.observable(name);
        self.meal = ko.observable(initialMeal);
        self.note = ko.observable(note);

        self.formattedPrice = ko.computed(function() {
            var price = self.meal().price;
            return price ? "$" + price.toFixed(2) : "None";
        });
    }

    function AppViewModel() {

        var self = this;

        self.availableMeals = [
            { mealName: "Standard (sandwich)", price: 0 },
            { mealName: "Premium (lobster)", price: 34.95 },
            { mealName: "Ultimate (whole zebra)", price: 290 }
        ];

        self.seats = ko.observableArray([
            new SeatReservation("Steve", self.availableMeals[1], "Will be paying with credit card."),
            new SeatReservation("Bert", self.availableMeals[2], "Needs a vaildation stamp for parking.")
        ]);


        self.totalSurcharge = ko.computed(function() {
            var total = 0;
            for (var i = 0; i < self.seats().length; i++)
                total += self.seats()[i].meal().price;
            return total;
        });


        self.addSeat = function() {
            if (self.seats().length >= 5) {
                Materialize.toast('Cannot Add More than 5 Reservations.', 2000);
            } else {
                self.seats.push(new SeatReservation("", self.availableMeals[1], "Note for Customer"));
                Materialize.toast('Added a new Reservation.', 2000);
            }
        };

        self.removeSeat = function(seat) {
            self.seats.remove(seat);
            Materialize.toast("Seat Has Been Removed.", 2000);
        };

        self.removeAllSeats = function() {
            if (self.seats().length > 0) {
                self.seats([]);
                Materialize.toast("All Seats have been cleared.", 2000);
            }

        };

        self.saveSeats = function() {
            $('.overlay').fadeIn(1000).delay(1000).fadeOut(1000);
            Materialize.toast("Loading...", 2000, '', function(){
                Materialize.toast("Reservations for " + self.seats().length + " at this table has been saved.", 4000);
                self.seats([]);
            });
        };

        self.query = ko.observable("");
        self.filteredSeatsByName = ko.computed(function () {
            var filter = self.query().toLowerCase();

            if (!filter) {
                return self.seats();
            } else {
                return ko.utils.arrayFilter(self.seats(), function (item) {
                    return item.name().toLowerCase().indexOf(filter) !== -1;
                });
            }
        });

    }

    ko.bindingHandlers.materializeDropdown = {
        init: function(element, valueAccessor) {
            $(element).material_select();
        },
        update: function(element, valueAccessor, allBindings) {
        }
    };

    ko.applyBindings(new AppViewModel());