$(document).ready(function(){
        $('#sub').click(function(){
            //alert("Submitted");
            $("propertyregisterfrom").submit();
            console.log('form data');
            $('#myModal').modal('hide');
            
             var data = $('#propertyregisterfrom').serializeArray();
        
        for(i in data){
            
            var x = data[i];
            
            console.log(x.value);
        }
            
            
        });
});
