(function(_win, _doc, undefined) {
    'use strict';

    /*
     * aliasses
     * _win: window global object
     * _doc: document object
     */

    // grid builder functionality
    var gridbuilder = (function () {

        var _build = function (options) {
            var numberOfColumns = options.columns,
                columnGap = options.gap,
                columnUnit,
                result = {};

            columnUnit = (100 - columnGap * (numberOfColumns-1))/numberOfColumns;

            if (columnUnit < 1) {
                return -1;
            }

            for (var i = 1; i < numberOfColumns; i++) {
                result[i + ''] = columnUnit*i + columnGap*(i - 1);
            }

            result[numberOfColumns + ''] = 100;

            return {
                styles: _buildStyles(result, columnGap),
                html: _buildHTML(numberOfColumns)
            };
        };

        var _buildStyles = function (columns, marginLeft) {
            var styles = '.row {\n  margin: 0px auto;\n  max-width: 950px;\n  padding: 55px;\n}\n\n' +
                '.column {\n  float: left;\n  margin-left: ' + marginLeft + '%;\n  min-height: 1px;\n}\n\n';

            for (var key in columns) {
                styles += '.column-' + key + ' {\n  width: ' + columns[key] + '%;\n}\n\n';
            }

            styles += '.column:first-child {\n  margin: 0;\n}\n\n';

            return styles;
        };

        var _buildHTML = function (columns) {
            var html = _doc.createElement('div');
            
            var __buildRow = function (i, col) {
                var numberOfColumns = Math.floor(col/i),
                    rest = col%i,
                    rowElement = _doc.createElement('div');

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

    // view model controller
    viewModel = (function () {
        var styleElement = _doc.createElement('style'),
            styleShow = _doc.getElementById('styles-show'),
            gridShow = _doc.getElementById('grid-show'),
            grid = _doc.querySelector('.grid'),
            styles = _doc.querySelector('.styles');

        _doc.head.appendChild(styleElement);
        
        var _formController = function () {
            var columnsInput = _doc.getElementById('columns'),
                gapInput = _doc.getElementById('gap'),
                submitButton = _doc.getElementById('submit'),
                downloadButton = _doc.getElementById('download'),
                validationPattern = /([1-9])+/i;

            var _validate = function () {
                var columns = columnsInput.value,
                    gap = gapInput.value;

                return validationPattern.test(columns) && validationPattern.test(gap);
            };

            submitButton.addEventListener('click', function(e) {
                styles.style.display = 'none';
                grid.style.display = 'none';
                downloadButton.classList.remove('visible');
                downloadButton.href = '';
                if (_validate()) {
                    var result = gridbuilder.build({
                        columns: +columnsInput.value,
                        gap: +gapInput.value
                    });
                    // check if numbers are good
                    if (result !== -1) {
                        view(result);
                        downloadButton.href = 'data:text/css;charset=UTF-8,' + result.styles;
                        downloadButton.classList.add('visible');
                    } else {
                        alert('The amount of gap is too high or you need more columns');    
                    }
                } else {
                    alert('You must fill both fields with valid number values');
                }
                return false;
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

})(window, document);