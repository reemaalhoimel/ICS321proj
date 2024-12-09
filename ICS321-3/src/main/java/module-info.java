module com.example.ics3213 {
    requires javafx.controls;
    requires javafx.fxml;

    requires org.kordamp.bootstrapfx.core;

    opens com.example.ics3213 to javafx.fxml;
    exports com.example.ics3213;
}