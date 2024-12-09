package com.example.ics3213;

class Train {
    private final String trainId;
    private final String origin;
    private final String destination;
    private final String date;
    private int availableSeats;

    public Train(String trainId, String origin, String destination, String date, int availableSeats) {
        this.trainId = trainId;
        this.origin = origin;
        this.destination = destination;
        this.date = date;
        this.availableSeats = availableSeats;
    }

    public String getTrainId() {
        return trainId;
    }

    public String getOrigin() {
        return origin;
    }

    public String getDestination() {
        return destination;
    }

    public String getDate() {
        return date;
    }

    public int getAvailableSeats() {
        return availableSeats;
    }

    public int bookSeat() {
        if (availableSeats > 0) {
            return availableSeats--;
        }
        return -1;
    }

    @Override
    public String toString() {
        return trainId + " | " + origin + " -> " + destination + " | " + date + " | Seats: " + availableSeats;
    }
}
