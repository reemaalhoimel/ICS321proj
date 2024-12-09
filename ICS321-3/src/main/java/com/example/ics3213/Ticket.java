package com.example.ics3213;

    class Ticket {
        private final Train train;
        private final int seatNumber;

        public Ticket(Train train, int seatNumber) {
            this.train = train;
            this.seatNumber = seatNumber;
        }

        public Train getTrain() {
            return train;
        }

        public int getSeatNumber() {
            return seatNumber;
        }

        @Override
        public String toString() {
            return "Train: " + train.getTrainId() +
                    ", Seat: " + seatNumber +
                    ", Date: " + train.getDate() +
                    ", Route: " + train.getOrigin() + " -> " + train.getDestination();
        }
    }
