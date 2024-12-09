package com.example.ics3213;

import javafx.application.Application;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.geometry.Insets;
import javafx.scene.Scene;
import javafx.scene.control.*;
import javafx.scene.layout.*;
import javafx.stage.Stage;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class TrainBookingSystem extends Application {

    private final ObservableList<Train> trains = FXCollections.observableArrayList();
    private final List<Ticket> bookedTickets = new ArrayList<>();

    @Override
    public void start(Stage primaryStage) {
        primaryStage.setTitle("Train Booking System - Login");

        VBox loginRoot = new VBox(10);
        loginRoot.setPadding(new Insets(10));

        Label titleLabel = new Label("Login");
        titleLabel.setStyle("-fx-font-size: 18px; -fx-font-weight: bold;");

        TextField usernameField = new TextField();
        usernameField.setPromptText("Username");

        PasswordField passwordField = new PasswordField();
        passwordField.setPromptText("Password");

        Button loginButton = new Button("Login");
        Label loginStatusLabel = new Label();

        loginButton.setOnAction(e -> {
            String username = usernameField.getText().trim();
            String password = passwordField.getText().trim();

            if (isAdmin(username, password)) {
                openAdminDashboard(primaryStage);
            } else if (isRegularUser(username, password)) {
                searchTrains(primaryStage);
            } else {
                loginStatusLabel.setText("Invalid username or password.");
            }
        });
        initializeTrains();

        loginRoot.getChildren().addAll(titleLabel, usernameField, passwordField, loginButton, loginStatusLabel);

        Scene loginScene = new Scene(loginRoot, 300, 200);
        primaryStage.setScene(loginScene);
        primaryStage.show();
    }

    private boolean isAdmin(String username, String password) {
        // Hardcoded admin credentials
        return "admin".equals(username) && "admin123".equals(password);
    }

    private boolean isRegularUser(String username, String password) {
        // Hardcoded regular user credentials
        return "user".equals(username) && "user123".equals(password);
    }


    private void initializeTrains() {
        trains.add(new Train("TR001", "Riyadh", "Dammam", "2024-12-10", 50));
        trains.add(new Train("TR002", "Riyadh", "Jeddah", "2024-12-11", 60));
        trains.add(new Train("TR003", "Dammam", "Jeddah", "2024-12-12", 40));
        trains.add(new Train("TR004", "Riyadh", "Mecca", "2024-12-13", 45));
        trains.add(new Train("TR005", "Mecca", "Medina", "2024-12-14", 30));
        trains.add(new Train("TR006", "Jeddah", "Tabuk", "2024-12-15", 25));
        trains.add(new Train("TR007", "Tabuk", "Dammam", "2024-12-16", 35));
        trains.add(new Train("TR008", "Riyadh", "Hail", "2024-12-17", 50));
        trains.add(new Train("TR009", "Hail", "Mecca", "2024-12-18", 20));
        trains.add(new Train("TR010", "Jeddah", "Medina", "2024-12-19", 15));
        trains.add(new Train("TR011", "Medina", "Tabuk", "2024-12-20", 10));
        trains.add(new Train("TR012", "Dammam", "Riyadh", "2024-12-21", 55));
    }


    private void searchTrains(Stage stage) {
        Stage searchStage = new Stage();
        searchStage.setTitle("Search, Book, and View Tickets");

        VBox root = new VBox(10);
        root.setPadding(new Insets(10));

        Label instructions = new Label("Enter Search Criteria:");
        TextField originField = new TextField();
        originField.setPromptText("Origin");
        TextField destinationField = new TextField();
        destinationField.setPromptText("Destination");
        TextField dateField = new TextField();
        dateField.setPromptText("Date (YYYY-MM-DD)");

        Button searchButton = new Button("Search");
        ListView<Train> resultsList = new ListView<>();

        // Booking UI components
        Button bookButton = new Button("Book Selected Train");
        Label bookingStatusLabel = new Label();

        // View Tickets Button
        Button viewTicketsButton = new Button("View Tickets");
        viewTicketsButton.setOnAction(e -> viewTickets(searchStage));

        // Current Active Trains Button
        Button activeTrainsButton = new Button("View Current Active Trains");
        activeTrainsButton.setOnAction(e -> viewActiveTrains(searchStage));

        searchButton.setOnAction(e -> {
            String origin = originField.getText().trim();
            String destination = destinationField.getText().trim();
            String date = dateField.getText().trim();

            // Filter trains based on user input
            resultsList.setItems(trains.filtered(train ->
                    train.getOrigin().equalsIgnoreCase(origin) &&
                            train.getDestination().equalsIgnoreCase(destination) &&
                            train.getDate().equals(date)
            ));
            bookingStatusLabel.setText(""); // Clear booking status when searching again
        });

        bookButton.setOnAction(e -> {
            Train selectedTrain = resultsList.getSelectionModel().getSelectedItem();
            if (selectedTrain != null) {
                int seatNumber = selectedTrain.bookSeat();
                if (seatNumber > 0) {
                    Ticket ticket = new Ticket(selectedTrain, seatNumber);
                    bookedTickets.add(ticket);
                    bookingStatusLabel.setText("Booking successful! Ticket: " + ticket);
                } else {
                    bookingStatusLabel.setText("No seats available on the selected train.");
                }
            } else {
                bookingStatusLabel.setText("Please select a train to book.");
            }
        });

        root.getChildren().addAll(
                instructions, originField, destinationField, dateField, searchButton,
                new Label("Search Results:"), resultsList,
                bookButton, bookingStatusLabel, viewTicketsButton, activeTrainsButton
        );

        searchStage.setScene(new Scene(root, 400, 600));
        searchStage.show();
    }

    private void viewTickets(Stage stage) {
        Stage ticketsStage = new Stage();
        ticketsStage.setTitle("Your Tickets");

        VBox root = new VBox(10);
        root.setPadding(new Insets(10));

        ListView<Ticket> ticketsListView = new ListView<>(FXCollections.observableArrayList(bookedTickets));
        root.getChildren().addAll(new Label("Your Tickets:"), ticketsListView);

        ticketsStage.setScene(new Scene(root, 400, 300));
        ticketsStage.show();
    }

    private void openAdminDashboard(Stage stage) {
        Stage adminStage = new Stage();
        adminStage.setTitle("Admin Dashboard - Functions of Staff/Admin");

        VBox root = new VBox(10);
        root.setPadding(new Insets(10));

        Label adminLabel = new Label("Admin Functions");
        adminLabel.setStyle("-fx-font-size: 18px; -fx-font-weight: bold;");

        Button manageReservationsButton = new Button("Add/Edit/Cancel Reservations");
        Button assignStaffButton = new Button("Assign Staff to Train");
        Button promoteWaitlistButton = new Button("Promote Waitlisted Passenger");
        Button activeTrainsButton = new Button("View Current Active Trains");
        Button listStationsButton = new Button("List Stations for Each Train");
        Button waitlistedLoyaltyButton = new Button("View Waitlisted Loyalty Passengers");
        Button logoutButton = new Button("Log Out");

        manageReservationsButton.setOnAction(e -> manageReservations(adminStage));
        assignStaffButton.setOnAction(e -> assignStaff(adminStage));
        promoteWaitlistButton.setOnAction(e -> promoteWaitlist(adminStage));
        activeTrainsButton.setOnAction(e -> viewActiveTrains(adminStage));
        listStationsButton.setOnAction(e -> listStationsForTrain(adminStage));
        waitlistedLoyaltyButton.setOnAction(e -> viewWaitlistedLoyaltyPassengers(adminStage));
        logoutButton.setOnAction(e -> adminStage.close());

        root.getChildren().addAll(
                adminLabel,
                manageReservationsButton,
                assignStaffButton,
                promoteWaitlistButton,
                activeTrainsButton,
                listStationsButton,
                waitlistedLoyaltyButton,
                logoutButton
        );

        adminStage.setScene(new Scene(root, 400, 400));
        adminStage.show();
    }


    private void manageReservations(Stage stage) {
        Stage reservationStage = new Stage();
        reservationStage.setTitle("Manage Reservations");

        VBox root = new VBox(10);
        root.setPadding(new Insets(10));

        ListView<Ticket> ticketListView = new ListView<>(FXCollections.observableArrayList(bookedTickets));

        Button addButton = new Button("Add Reservation");
        Button editButton = new Button("Edit Selected Reservation");
        Button cancelButton = new Button("Cancel Selected Reservation");

        Label statusLabel = new Label();

        addButton.setOnAction(e -> {
            // Logic to add a new reservation (e.g., open a form)
            statusLabel.setText("Feature: Add Reservation (to be implemented).");
        });

        editButton.setOnAction(e -> {
            Ticket selectedTicket = ticketListView.getSelectionModel().getSelectedItem();
            if (selectedTicket != null) {
                // Logic to edit the reservation (e.g., modify details)
                statusLabel.setText("Feature: Edit Reservation (to be implemented).");
            } else {
                statusLabel.setText("No reservation selected for editing.");
            }
        });

        cancelButton.setOnAction(e -> {
            Ticket selectedTicket = ticketListView.getSelectionModel().getSelectedItem();
            if (selectedTicket != null) {
                bookedTickets.remove(selectedTicket);
                ticketListView.setItems(FXCollections.observableArrayList(bookedTickets));
                statusLabel.setText("Reservation canceled successfully.");
            } else {
                statusLabel.setText("No reservation selected for cancellation.");
            }
        });

        root.getChildren().addAll(
                new Label("Manage Reservations/Tickets:"),
                ticketListView,
                addButton, editButton, cancelButton,
                statusLabel
        );

        reservationStage.setScene(new Scene(root, 400, 400));
        reservationStage.show();
    }

    private void assignStaff(Stage stage) {
        Stage staffStage = new Stage();
        staffStage.setTitle("Assign Staff to Train");

        VBox root = new VBox(10);
        root.setPadding(new Insets(10));

        ListView<Train> trainListView = new ListView<>(trains);
        trainListView.setPrefHeight(200);

        TextField staffNameField = new TextField();
        staffNameField.setPromptText("Enter Staff Name");

        ChoiceBox<String> staffRoleChoice = new ChoiceBox<>();
        staffRoleChoice.getItems().addAll("Driver", "Engineer");

        Button assignButton = new Button("Assign Staff");
        Label statusLabel = new Label();

        assignButton.setOnAction(e -> {
            Train selectedTrain = trainListView.getSelectionModel().getSelectedItem();
            String staffName = staffNameField.getText().trim();
            String role = staffRoleChoice.getValue();

            if (selectedTrain != null && !staffName.isEmpty() && role != null) {
                statusLabel.setText(role + " " + staffName + " assigned to " + selectedTrain.getTrainId() + " on " + selectedTrain.getDate());
            } else {
                statusLabel.setText("Please select a train, enter staff name, and choose a role.");
            }
        });

        root.getChildren().addAll(
                new Label("Assign Staff to a Train:"),
                trainListView,
                staffNameField, staffRoleChoice, assignButton,
                statusLabel
        );

        staffStage.setScene(new Scene(root, 400, 400));
        staffStage.show();
    }

    private void promoteWaitlist(Stage stage) {
        Stage waitlistStage = new Stage();
        waitlistStage.setTitle("Promote Waitlisted Passenger");

        VBox root = new VBox(10);
        root.setPadding(new Insets(10));

        // Dummy waitlist for demonstration
        ObservableList<String> waitlist = FXCollections.observableArrayList("Passenger1", "Passenger2", "Passenger3");
        ListView<String> waitlistView = new ListView<>(waitlist);

        Button promoteButton = new Button("Promote Selected Passenger");
        Label statusLabel = new Label();

        promoteButton.setOnAction(e -> {
            String selectedPassenger = waitlistView.getSelectionModel().getSelectedItem();
            if (selectedPassenger != null) {
                waitlist.remove(selectedPassenger);
                statusLabel.setText(selectedPassenger + " has been promoted to an available seat.");
            } else {
                statusLabel.setText("No passenger selected for promotion.");
            }
        });

        root.getChildren().addAll(
                new Label("Waitlist:"),
                waitlistView,
                promoteButton,
                statusLabel
        );

        waitlistStage.setScene(new Scene(root, 400, 400));
        waitlistStage.show();
    }

    private void viewActiveTrains(Stage stage) {
        Stage activeTrainsStage = new Stage();
        activeTrainsStage.setTitle("Current Active Trains - Today");

        VBox root = new VBox(10);
        root.setPadding(new Insets(10));

        ListView<Train> activeTrainsListView = new ListView<>();

        // Filter trains running today
        String todayDate = "2024-12-08"; // Replace with dynamic date logic if needed
        activeTrainsListView.setItems(trains.filtered(train -> train.getDate().equals(todayDate)));

        root.getChildren().addAll(new Label("Active Trains Today:"), activeTrainsListView);

        activeTrainsStage.setScene(new Scene(root, 400, 300));
        activeTrainsStage.show();
    }



    private void listStationsForTrain(Stage stage) {
        Stage stationsStage = new Stage();
        stationsStage.setTitle("Stations for Each Train");

        VBox root = new VBox(10);
        root.setPadding(new Insets(10));

        ListView<Train> trainListView = new ListView<>(trains);
        trainListView.setPrefHeight(200);

        ListView<String> stationListView = new ListView<>();

        trainListView.getSelectionModel().selectedItemProperty().addListener((obs, oldSelection, newSelection) -> {
            if (newSelection != null) {
                // Simulated station data (you can replace this with real station data)
                List<String> stations = List.of(
                        "Station A", "Station B", "Station C", "Station D"
                );
                stationListView.setItems(FXCollections.observableArrayList(stations));
            }
        });

        root.getChildren().addAll(
                new Label("Select a Train to View Stations:"),
                trainListView,
                new Label("Stations:"), stationListView
        );

        stationsStage.setScene(new Scene(root, 400, 400));
        stationsStage.show();
    }


    private void viewReservationDetails(Stage stage) {
        Stage reservationStage = new Stage();
        reservationStage.setTitle("Reservation Details");

        VBox root = new VBox(10);
        root.setPadding(new Insets(10));

        TextField passengerIdField = new TextField();
        passengerIdField.setPromptText("Enter Passenger ID");

        Button searchButton = new Button("Search");
        ListView<Ticket> reservationListView = new ListView<>();

        searchButton.setOnAction(e -> {
            String passengerId = passengerIdField.getText().trim();
            // Filter reservations based on passenger ID (replace with real logic)
            reservationListView.setItems(FXCollections.observableArrayList(
                    bookedTickets.stream()
                            .filter(ticket -> ticket.getTrain().getTrainId().equalsIgnoreCase(passengerId))
                            .toList()
            ));
        });

        root.getChildren().addAll(
                new Label("Reservation Details for Passenger ID:"),
                passengerIdField, searchButton, reservationListView
        );

        reservationStage.setScene(new Scene(root, 400, 400));
        reservationStage.show();
    }
    private void viewWaitlistedLoyaltyPassengers(Stage stage) {
        Stage waitlistStage = new Stage();
        waitlistStage.setTitle("Waitlisted Loyalty Passengers");

        VBox root = new VBox(10);
        root.setPadding(new Insets(10));

        TextField trainNumberField = new TextField();
        trainNumberField.setPromptText("Enter Train Number");

        Button searchButton = new Button("Search");
        ListView<String> loyaltyPassengersListView = new ListView<>();

        searchButton.setOnAction(e -> {
            String trainNumber = trainNumberField.getText().trim();
            // Simulated waitlisted loyalty passengers for a train
            List<String> waitlist = List.of("LoyaltyPassenger1", "LoyaltyPassenger2", "LoyaltyPassenger3");
            loyaltyPassengersListView.setItems(FXCollections.observableArrayList(waitlist));
        });

        root.getChildren().addAll(
                new Label("Enter Train Number to View Waitlisted Loyalty Passengers:"),
                trainNumberField, searchButton, loyaltyPassengersListView
        );

        waitlistStage.setScene(new Scene(root, 400, 400));
        waitlistStage.show();
    }




    public static void main(String[] args) {
        launch(args);
    }

}

