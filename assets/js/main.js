// Lấy baseUrl tự động (http/https + host + port)
let baseUrl = window.location.origin;

// Plugin responsive cho bảng
$("table").rtResponsiveTables();

// ------------------- ADD DRUG -------------------
$("#add_drug").submit(function(event){
    event.preventDefault();

    let formData = $(this).serializeArray();
    let data = {};
    $.map(formData, function(n) { data[n['name']] = n['value']; });

    $.ajax({
        url: `${baseUrl}/api/drugs`,
        method: "POST",
        data: data
    }).done(function(response){
        alert(`${data.name} added successfully!`);
        window.location.href = "/manage";
    }).fail(function(err){
        alert("Failed to add drug: " + err.responseText);
    });
});

// ------------------- UPDATE DRUG -------------------
$("#update_drug").submit(function(event){
    event.preventDefault();

    let formData = $(this).serializeArray();
    let data = {};
    $.map(formData, function(n) { data[n['name']] = n['value']; });

    $.ajax({
        url: `${baseUrl}/api/drugs/${data.id}`,
        method: "PUT",
        data: data
    }).done(function(response){
        alert(`${data.name} updated successfully!`);
        window.location.href = "/manage";
    }).fail(function(err){
        alert("Failed to update drug: " + err.responseText);
    });
});

// ------------------- DELETE DRUG -------------------
if(window.location.pathname === "/manage"){
    $("table tbody td a.delete").click(function(){
        let id = $(this).attr("data-id");

        if(confirm("Do you really want to delete this drug?")){
            $.ajax({
                url: `${baseUrl}/api/drugs/${id}`,
                method: "DELETE"
            }).done(function(response){
                alert("Drug deleted successfully!");
                location.reload();
            }).fail(function(err){
                alert("Failed to delete drug: " + err.responseText);
            });
        }
    });
}

// ------------------- PURCHASE -------------------
if(window.location.pathname === "/purchase"){
    $("#drug_days").submit(function(event){
        event.preventDefault();
        let days = +$("#days").val();

        $("#purchase_table").show();
        alert("Drugs for " + days + " days!");
    });
}
