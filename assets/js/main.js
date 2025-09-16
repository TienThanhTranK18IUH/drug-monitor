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
if(window.location.pathname === "/purchase") {
    // Submit form để tính toán lại
    $("#drug_days").submit(function(event){
        event.preventDefault();
        let days = +$("#days").val();

        $("table#purchase_table tbody tr").each(function(){
            let perDay = +$(this).data("perday");
            let card = +$(this).data("card");
            let pack = +$(this).data("pack");

            let pills = days * perDay;

            let cardsNeeded = Math.ceil(pills / card);
            let cardInfo = `${cardsNeeded} (${pack/card} ${pack/card < 2 ? "card" : "cards"} per pack)`;

            let packsNeeded = Math.ceil(pills / pack);

            $(this).find(".cards-cell").text(cardInfo);
            $(this).find(".packs-cell").text(packsNeeded);
        });

        $("#purchase_table").show();
    });

    // Nút mua thuốc
    $(".purchase-btn").click(function(){
        let row = $(this).closest("tr");
        let id = row.data("id");
        let packsNeeded = row.find(".packs-cell").text();

        if(confirm(`Bạn có chắc muốn mua ${packsNeeded} pack(s)?`)) {
            $.ajax({
                url: `${window.location.origin}/api/drugs/${id}/purchase`,
                method: "POST",
                data: { quantity: packsNeeded }
            }).done(function(response){
                alert(response.message);
                location.reload();
            }).fail(function(err){
                alert("❌ Lỗi khi mua: " + err.responseText);
            });
        }
    });
}

