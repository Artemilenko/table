class MultiWidget {
    constructor() {
        this.leftField = document.querySelector('.multiselect-widget__list-content--left');
        this.rightField = document.querySelector('.multiselect-widget__list-content--right');
        this.fields = document.querySelectorAll('.multiselect-widget__list-content');
        this.leftText = document.querySelector('.multiselect-widget__header-text--left');
        this.rightText = document.querySelector('.multiselect-widget__header-text--right');
        this.searchField = document.querySelector('.multiselect-widget__header-search');
        this.leftArrow = document.querySelector('.multiselect-widget__button--arrow-left');
        this.rightArrow = document.querySelector('.multiselect-widget__button--arrow-right');
        this.buttonSearch = document.querySelector('.multiselect-widget__button--search');
        this.userCountLeft = document.querySelector('.multiselect-widget__count--left');
        this.userCountRight = document.querySelector('.multiselect-widget__count--right');
        this.form = document.querySelector('#create_user_form');
        this.countRight = 0;
        this.countLeft = 0;
        this.users = {};
        this.ids = {};
        this.dropElem = false;
    }

    async get(url) {
        let result = await fetch(url);
        return await result.json();
    }

    search(btn) {
        btn.addEventListener('click', () => {
            this.rightText.classList.toggle('active__right-text');
            this.searchField.classList.toggle('active__header-search');
        });
    }

    createUser(name, outputField, style) {
        const user = document.createElement('div');
        user.classList.add(style, 'selected__user');
        user.setAttribute('draggable', true);
        outputField.append(user);
        user.textContent = name;
    }

    counter(field, count) {
        if (field.children.length === 0) {
            count.textContent = 'Geen';
        } else {
            count.textContent = field.children.length;
        }
    }

    counterRun() {
        this.counter(this.leftField, this.userCountLeft);
        this.counter(this.rightField, this.userCountRight);
    }

    enumeratingItemsForBuffer(bufferObj, mainObj) {
        for (let key in mainObj) {
            bufferObj[Object.keys(bufferObj).length] = mainObj[key];
        }
    }

    creatingMultipleUsers(obj, field, styleClass) {
        for (let key in obj) {
            this.createUser(obj[key].name, field, styleClass);
        }
    }

    fieldsDragover() {
        this.fields.forEach(field => {
            field.addEventListener('dragover', e => {
                e.preventDefault();
            });
        });
    }

    responseProcessing(response, key, reg, searchField, outputField) {
        if (response[key].search(reg) != -1 && searchField.value.length != 0) {
            this.createUser(response[key], outputField, 'multiselect-widget__force-right');
            this.countRight++;
            this.counterRun();
            this.users[Object.keys(this.users).length] = {id: key, name: response[key]};
        }
    }

    dragStart(field) {
        field.addEventListener('dragstart', e => {
            const target = e.target || e.srcElement;
            this.dropElem = target;
        });
    }

    right(fieldFrom, fieldTo) {
        for (let i = 0; i < fieldFrom.children.length; i++) {
            for (let key in this.users) {
                if (this.users[key].name === this.dropElem.textContent) {
                    let buffer = {};
                    this.enumeratingItemsForBuffer(buffer, this.ids);
                    this.ids = {};
                    this.ids[key] = this.users[key];
                    this.enumeratingItemsForBuffer(buffer, this.ids);
                    this.ids = Object.assign({}, buffer);
                    delete this.users[key];
                }
            }
            fieldTo.innerHTML = '';
            this.creatingMultipleUsers(this.ids, fieldTo, 'multiselect-widget__force-left');
            this.dropElem.remove();
            this.counterRun();
        }
        this.dropElem = false;
    }

    left(fieldFrom, fieldTo) {
        for (let i = 0; i < fieldFrom.children.length; i++) {
            for (let key in this.ids) {
                if (this.ids[key].name === this.dropElem.textContent) {
                    let buffer = {};
                    this.enumeratingItemsForBuffer(buffer, this.users);
                    this.users = {};
                    this.users[key] = this.ids[key];
                    this.enumeratingItemsForBuffer(buffer, this.users);
                    this.users = Object.assign({}, buffer);
                    delete this.ids[key];
                }
            }
            fieldTo.innerHTML = '';
            this.creatingMultipleUsers(this.users, fieldTo, 'multiselect-widget__force-right');
            this.dropElem.remove();
            this.counterRun();
        }
        this.dropElem = false;
    }

    getUsers(searchField, outputField) {
        let reg;
        searchField.addEventListener('input', () => {
            if (searchField.value.length > 2) {
                this.value = searchField.value;
                this.users = {};
                this.countRight = 0;
                reg = new RegExp(searchField.value, 'gi');
                if (this.leftField.children.length === 0) {
                    this.ids = {};
                    this.get(`{{ route('getUserLikeName') }}?user_name=${searchField.value}`)
                    .then(response => {
                        for (let key in response) {
                            this.responseProcessing(response, key, reg, searchField, outputField);
                        }
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
                    outputField.innerHTML = '';
                } else {
                    this.get(`{{ route('getUserLikeName') }}?user_name=${searchField.value}`)
                    .then(response => {
                        let flag = false;
                        for (let key in response) {
                            for (let guest in this.ids) {
                                if (this.ids[guest].id !== key) {
                                    flag++;
                                }
                            }
                            if (Object.keys(this.ids).length === flag) {
                                this.responseProcessing(response, key, reg, searchField, outputField);
                            }
                            flag = 0
                        }
                    });
                    outputField.innerHTML = '';
                }  
            }
        });
    }

    redirectAllRight(btn, outputField) {
        btn.addEventListener('click', () => {
            if (this.leftField.children.length !== 0) {
                this.rightField.innerHTML = '';
                this.creatingMultipleUsers(this.users, outputField, 'multiselect-widget__force-left');
                let buffer = {};
                this.enumeratingItemsForBuffer(buffer, this.ids);
                this.enumeratingItemsForBuffer(buffer, this.users);
                this.ids = Object.assign({}, buffer);
                this.users = {};
                this.counterRun();
            } else {
                this.rightField.innerHTML = '';
                this.creatingMultipleUsers(this.users, outputField, 'multiselect-widget__force-left');
                this.ids = Object.assign({}, this.users);
                this.users = {};
                this.counterRun();
            }
        });
    }

    redirectAllLeft(btn, outputField) {
        btn.addEventListener('click', () => {
            if (outputField.children.length !== 0) {
                this.creatingMultipleUsers(this.ids, outputField, 'multiselect-widget__force-right');
                let buffer = {};
                this.enumeratingItemsForBuffer(buffer, this.users);
                this.enumeratingItemsForBuffer(buffer, this.ids);
                this.users = Object.assign({}, buffer);
                this.leftField.innerHTML = '';
                this.ids = {};
                this.counterRun();
            } else {
                this.creatingMultipleUsers(this.ids, outputField, 'multiselect-widget__force-right');
                this.leftField.innerHTML = '';
                this.users = Object.assign({}, this.ids);
                this.ids = {};
                this.counterRun();
            }
        });
    }

    redirectOneRight(fieldFrom, fieldTo) {
        fieldFrom.addEventListener('click', e => {
            const target = e.target || e.srcElement;
            this.dropElem = target;
            this.right(fieldFrom, fieldTo);
        });
        this.dragStart(fieldFrom);
        fieldTo.addEventListener('drop', () => {
            this.right(fieldFrom, fieldTo);
        });
    }

    redirectOneLeft(fieldFrom, fieldTo) {
        fieldFrom.addEventListener('click', e => {
            const target = e.target || e.srcElement;
            this.dropElem = target;
            this.left(fieldFrom, fieldTo);
        });

        this.dragStart(fieldFrom);
        fieldTo.addEventListener('drop', () => {
            this.left(fieldFrom, fieldTo);
        });
    }

    formPost() {
        this.form.addEventListener('submit', e => {
            e.preventDefault();
            for (let key in this.ids) {
                    const input = document.createElement('input');
                    input.setAttribute('name', 'ids[]');
                    input.setAttribute('value', this.ids[key].id);
                    input.style.display = 'none';
                    this.form.append(input);
                }
            this.searchField.remove();
            this.form.submit();
        });
    }

    init() {
        this.getUsers(this.searchField, this.rightField);
        this.redirectAllRight(this.rightArrow, this.leftField);
        this.redirectAllLeft(this.leftArrow, this.rightField);
        this.search(this.buttonSearch);
        this.fieldsDragover();
        this.redirectOneRight(this.rightField, this.leftField);
        this.redirectOneLeft(this.leftField, this.rightField);
        this.formPost();
    }
}

new MultiWidget().init();