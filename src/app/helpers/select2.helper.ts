const Select2Helper = () => {
    const getDefaultOptions = () => {
      return {
          theme: 'bootstrap',
          placeholder: 'Seleccionar',
          allowClear: true,
          width: '100%',
          language: "es"
      }
    };

    const setAttributesToValidate = (element: any, field: string) => {
        element.attr({
            'required': true, 
            'id': field, 
            'name': field, 
            'formControlName': name
        });

        element.addClass('select2-validator');

        element
            .on("select2:unselecting", function(e) {
                $(this).data('state', 'unselected');
            })
            .on("select2:open", function(e) {
                const $this =  $(this);
            
                if ($this.data('state') === 'unselected') {
                    $this.removeData('state'); 
                    
                    setTimeout(() => {
                        $this.select2('close');
                    }, 0);
                }    
            });
    }

    return {
        getDefaultOptions: getDefaultOptions,
        setAttributesToValidate: setAttributesToValidate
    }
};

export default Select2Helper;