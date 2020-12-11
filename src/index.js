$('#Checkout').modal('hide');

var BuyerName = null;
var Name = null;
var Description = null;
var Price = null;
$(document).on('click', '.Buy', function(){
    Name = $(this).parent().attr('data-name');
    Description = $(this).parent().attr('data-description');
    Price = $(this).parent().attr('data-price');
    $('#Checkout .modal-title').text(' '+Description+' '+Name+' | Donate '+Price+'Birr');
    $('.BuyNow').attr('disabled', false);
    $('.BuyerName').val('');
    $('.PhoneNumber').val('');
    $('.MSG').hide();
    $('.MSG.alert-danger').text('');
    $('.MSG.alert-success').text('');
    $('#Checkout').modal('toggle');
});

var BuyerName = null;
var PhoneNumber = null;
$(document).on('click', '.BuyNow', function(){
    BuyerName = $('.BuyerName').val();
    PhoneNumber = $('.PhoneNumber').val();
    $('.MSG').hide();
    if(BuyerName === ""){
        $('.MSG.alert-danger').text('Your name is required!').show();
    }else if(PhoneNumber === ""){
        $('.MSG.alert-danger').text('Phone required!').show();
    }else{
        $('.BuyNow').attr('disabled', true).text('Processing...');
        $.ajax({
            url: window.location.origin+"/buy-now",
            type: 'POST',
            dataType: "json",
            data: {
                BuyerName: BuyerName,
                Name: Name,
                Description: Description,
                Price: Price,
                PhoneNumber: PhoneNumber
            },
            success: async function(response){
                console.log(response);
                if(response.error){
                    $('.BuyNow').attr('disabled', false).text('Buy Now');
                    $('.MSG.alert-danger').text(response.error.details).show();
                }else{
                    $('.BuyNow').attr('disabled', true).text('Buy Now');
                    $('.MSG.alert-success').html(`ID/Invoice Code: <strong>`+response.code+`</strong><br>
                    Please pay us using your HelloCash account or go to any HelloCash agent to pay
                    እባክዎን የሄሎካሽ አካውንትዎን በመጠቀም ይክፈሉን ወይም ለመክፈል ወደ ማንኛውም ሄሎካሽ ወኪል ይሂዱ
                    `+response.code+``).show();
                }
            },
            error: function(error){
                $('.BuyNow').attr('disabled', false).text('Buy Now');
                console.log(error);
            }
        });
    }
});

$(document).ready(function(){
    
});