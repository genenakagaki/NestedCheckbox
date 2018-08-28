// ########################################
//             Main Checkbox
// ########################################
function NcMainCkbx(container, parentCkbx) {
    this.ckbx = container.querySelector('.nc-main input[type=checkbox]');
    this.parentCkbx = parentCkbx;
    this.childCkbxList = [];

    console.log(container);
    // If there are nc containers
    var ncContainers = container.querySelectorAll('.nc-container');
    if (ncContainers.length > 0) {
        console.log("her3e");
        for (var i = 0; i < ncContainers.length; i++) {
            var ncCkbx = new NcMainCkbx(ncContainers[i], this);
            this.childCkbxList.push(ncCkbx);
        }
    } else {
        // Get child checkboxes
        var childCkbxElems = container.querySelector('.nc-sub-container').querySelectorAll('.nc-sub input[type=checkbox]');
        for (var i = 0; i < childCkbxElems.length; i++) {
            this.childCkbxList.push(new NcSubCkbx(childCkbxElems[i], this));
        }
    }

    var self = this;

    this.ckbx.onchange = function (ev) {
        self.changeChecked(ev.target.checked);
    }
}

NcMainCkbx.prototype.onChildChange = function (isChecked) {
    console.log("NcMainCkbx onChildChange:" + isChecked);
    if (isChecked) {
        // Check if all the children are checked
        for (var i = 0; i < this.childCkbxList.length; i++) {
            if (!this.childCkbxList[i].ckbx.checked) {
                return;
            }
        }

        this.ckbx.checked = isChecked;
        if (this.parentCkbx != undefined) {
            this.parentCkbx.onChildChange(isChecked);
        }
    } else {
        // Uncheck self and parent checkbox
        this.ckbx.checked = isChecked;
        if (this.parentCkbx != undefined) {
            this.parentCkbx.onChildChange(isChecked);
        }
    }
}

NcMainCkbx.prototype.changeChecked = function (isChecked) {
    console.log("NcMainCkbx changeChecked: " + isChecked);

    this.ckbx.checked = isChecked;

    if (this.childCkbxList != undefined) {
        for (var i = 0; i < this.childCkbxList.length; i++) {
            this.childCkbxList[i].changeChecked(isChecked);
        }
    }

    if (!isChecked && this.parentCkbx != undefined && this.parentCkbx.ckbx.checked) {
        // Remove parent check
        this.parentCkbx.onChildChange(isChecked);
    }
}

// ########################################
//              Sub Checkbox
// ########################################
function NcSubCkbx(ckbx, parentCkbx) {
    this.ckbx = ckbx;
    this.parentCkbx = parentCkbx;

    var self = this;
    ckbx.onchange = function (ev) {
        self.changeChecked(ev.target.checked);
    }
}

NcSubCkbx.prototype.changeChecked = function (isChecked) {
    console.log("NcSubCkbx changeChecked: " + isChecked);

    this.ckbx.checked = isChecked;

    if (this.parentCkbx != undefined) {
        // Remove parent check
        this.parentCkbx.onChildChange(isChecked);
    }
}

// ########################################
//             Nested Checkbox
// ########################################
function NestedCheckbox(element) {
    var ncContainers = element.querySelectorAll('.nc-top-container');

    for (var i = 0; i < ncContainers.length; i++) {
        new NcMainCkbx(ncContainers[i], undefined);
    }

    this.init(element);
}

NestedCheckbox.prototype.init = function (element) {
    var arrowBtns = element.querySelectorAll('.nc-arrow');

    for (var i = 0; i < arrowBtns.length; i++) {
        arrowBtns[i].addEventListener('click', function (e) {
            var ncContainers = this.parentElement.parentElement.querySelectorAll('.nc-container');
            var subContainer;
            if (ncContainers.length === 0) {
                subContainer = this.parentElement.parentElement.querySelector('.nc-sub-container');
            }

            var containerHeight;
            if (this.classList.contains('open')) {
                // Close if it is open
                this.classList.remove('open');
                containerHeight = 0;
            } else {
                // Open if it is closed
                this.classList.add('open');
                containerHeight = 'auto';
            }

            if (ncContainers.length > 0) {
                for (var i = 0; i < ncContainers.length; i++) {
                    ncContainers[i].style.height = containerHeight;
                }
            } else {
                subContainer.style.height = containerHeight;
            }
        });
    }
};
