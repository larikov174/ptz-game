export default class FormValidator {
  constructor(config, form) {
    this._config = config;
    this._form = form;
    this._inputList = this._form.querySelectorAll(this._config.inputList);
    this._button = this._form.querySelector(this._config.buttonElement);
  }

  _showInputError(inputElement, errorMsg) {
    const errorUnit = this._form.querySelector(`#${inputElement.id}-error`);
    inputElement.classList.add(this._config.inputError);
    errorUnit.textContent = errorMsg;
    errorUnit.classList.add(this._config.errorActive);
  }

  _hideInputError(inputElement) {
    const errorUnit = this._form.querySelector(`#${inputElement.id}-error`);
    inputElement.classList.remove(this._config.inputError);
    errorUnit.classList.remove(this._config.errorActive);
    errorUnit.textContent = '';
  }

  _hasInvalidInput() {
    return Array.from(this._inputList)
      .some(input => !input.validity.valid);
  }

  _isValid(inputElement) {
    if (!inputElement.validity.valid) {
      this._showInputError(inputElement, inputElement.validationMessage);
    } else {
      this._hideInputError(inputElement);
    }
  }

  _toggleButtonState() {
    if (this._hasInvalidInput()) {
      this._button.disabled = true;
    } else {
      this._button.disabled = false;
    }
  }

  _validationOnInput() {
    this._toggleButtonState();
    this._inputList.forEach((inputElement) => {
      inputElement.addEventListener('input', () => {
        this._isValid(inputElement);
        this._toggleButtonState();
      });
    });
  }

  resetValidation() {
    this._inputList.forEach((inputElement) => {
      this._hideInputError(inputElement);
    });
    this._toggleButtonState();
  }

  enableValidation() {
    this._form.addEventListener('submit', (e) => e.preventDefault() );
    this._validationOnInput();
  }
}
