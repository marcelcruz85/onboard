$( document ).ready(function() {
    let data;
    let first = '';
    let last = '';
    let userName;
    let department = $('select[name="department"]').val()
    function randomString(length, chars) {
        var result = '';
        for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
        return result;
    }

    function creaUser() {
        userName = first + last;
        userName = userName.toLowerCase();

        $('input[id*=user]').each(function() {
            $(this).val(userName);
        });

        $('input#office_user').val(userName + '@consumerlaw.com')
    }

    var sugarPass = randomString(16, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
    $('input[name="sugar_password"]').val(sugarPass)

    var officePass = randomString(16, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
    $('input[name="office_password"]').val(officePass)

    var computerPass = randomString(16, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
    $('input[name="computer_password"]').val(computerPass)

    let setDefault = function setDefault() {
        let defaults = data.field.filter(el => el.key == "department")
        defaults = defaults[0].options.filter(el => el.val == department);
        defaults = defaults[0].default

        $('.field-container-list input[type="checkbox"]').prop( "checked", false );

        if(defaults.distributions.length > 0){
            defaults.distributions.forEach(el => $(`#${el}`).prop( "checked", true ))
        }
        if(defaults.teams.length > 0){
            defaults.teams.forEach(el => $(`#${el}`).prop( "checked", true ))
        }
        if(defaults.queues.length > 0){
            defaults.queues.forEach(el => $(`#${el}`).prop( "checked", true ))
        }
    }

    $.ajax({
        url: '../../configs/user.json',
        success: function(resp){
            data = resp
        }
    }).done(function( data ) {
        setDefault()
    });

    $('select[name="department"]').change(function(){
        department = $(this).val();
        setDefault()
    })

    $('#first_name').keyup(function () {
        first = $(this).val().charAt(0);
        creaUser()
        console.log(userName);
    })

    $('#last_name').keyup(function () {
        last = $(this).val();
        last = last.split(" ", 1)
        creaUser()
        console.log(userName);
    })


});
