const DatatablesHelper = () => {
    const initComplete = (settings: any, json: any) => {
        const tableId = settings.sTableId;
        const $_table = $('#' + tableId);
        const $_panel = $_table.parents('.panel');

        const $_containerLength = $_panel.find('.dt-select-length');
        const $_containerInfoResults = $_panel.find('.dt-info-results');
        const $_containerPagination = $_panel.find('.dt-pagination');

        $_containerLength.children().remove();
        $_containerInfoResults.children().remove();
        $_containerPagination.children().remove();

        const $_datatableLength = $_panel.find('.dataTables_length');
        const $_datatableInfo = $_panel.find('.dataTables_info');
        const $_datatablePaginate = $_panel.find('.dataTables_paginate');

        $_datatableLength.appendTo($_containerLength);
        $_containerInfoResults.append($_datatableInfo);
        $_containerPagination.append($_datatablePaginate);
    };

    const getFilterData = (instance: any, column: string,  value: any) => {
        return instance.data().filter(function(item) {
            return item[column] === value;
        })[0];
    }

    const renderDOM = `<\'hide\'lt><\'row\'<\'col-sm-12\'tr>><\'hide\'ip>`;


    const reloadData = ($instance: any,  resetPagination: boolean) => {
        $instance.ajax.reload(function(json){
        console.log('reload datatable');
        console.log(json);

        /*
        var count_ul = $_ulRow.length;

        for(var i = 0; i < count_ul; i++){
            var index = $($_ulRow[i]).data('dtrIndex');
            $('#' + tableId +' tbody tr')
                .not('tr.child')
                .eq(index)
                .children('td:eq(0)')
                .trigger('click');
        }

        */
    }, resetPagination);
    }

    return {
        initComplete: initComplete,
        getFilterData: getFilterData,
        renderDOM: renderDOM,
        reloadData: reloadData,
    };
};

export default DatatablesHelper;

