var gridbuilder = (function () {

    var _build = function (options) {
        var numberOfColumns = options.columns,
            columnGap = options.gap,
            columnUnit,
            result = {},
            styles,
            html;

        columnUnit = (100-columnGap*(numberOfColumns-1))/numberOfColumns;

        for (var i = 1; i < numberOfColumns; i++) {
            result[i + ''] = columnUnit*i + columnGap*(i - 1);
        }

        result[numberOfColumns + ''] = 100;

        styles = _buildStyles(result, columnGap);
        html = _buildHTML(numberOfColumns);

        return {
            styles: styles,
            html: html
        };
    };

    var _buildStyles = function (columns, marginLeft) {
        var styles = '.column { float: left; margin-left: ' + marginLeft + '%; min-height: 1px; }\n';

        for (var key in columns) {
            styles += '.column-' + key + ' { width: ' + columns[key] + '%; }\n';
        }

        styles += '.column:first-child { margin: 0; }';

        return styles;
    };

    var _buildHTML = function (columns) {
        var html = document.createElement('div');
        
        var __buildRow = function (i, col) {
            var numberOfColumns = Math.floor(col/i),
                rest = col%i,
                rowElement = document.createElement('div');

            rowElement.className = 'row';

            for (var j = 0; j < numberOfColumns; j++) {
                rowElement.innerHTML += '<div class="column column-' + i + '"></div>';
            }

            if (rest !== 0) {
                rowElement.innerHTML += '<div class="column column-' + rest + '"></div>';
            }

            return rowElement;
        };

        for (var i = 1; i < columns; i++) {
            html.appendChild(__buildRow(i, columns));
        }

        return html;
    };

    return {
        build : _build
    };

})();


viewModel = (function () {
    var styleElement = document.createElement('style'),
        styleShow = document.getElementById('styles-show'),
        gridShow = document.getElementById('grid-show'),
        grid = document.querySelector('.grid'),
        styles = document.querySelector('.styles');

    document.head.appendChild(styleElement);
    
    var _formController = function () {
        var columnsInput = document.getElementById('columns'),
            gapInput = document.getElementById('gap'),
            submitButton = document.getElementById('submit'),
            validationPattern = /([1-9])+/i;

        var _validate = function () {
            var columns = columnsInput.value,
                gap = gapInput.value;

            return validationPattern.test(columns) && validationPattern.test(gap);
        };

        submitButton.addEventListener('click', function (e) {
            e.preventDefault();
            if (_validate()) {
                var result = gridbuilder.build({
                    columns: +columnsInput.value,
                    gap: +gapInput.value
                });
                view(result);
            } else {
                alert('You must fill both fields with valid number values');
            }
        }, false);
    };

    var view = function (obj) {
        styleElement.innerHTML = obj.styles;
        styleShow.innerHTML = obj.styles;
        gridShow.innerHTML = '';
        gridShow.appendChild(obj.html);
        styles.style.display = 'block';
        grid.style.display = 'block';
    };

    _formController();
})();

window.onload = function () {
    document.body.className = 'loaded';
};