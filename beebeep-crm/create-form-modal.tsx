import { useEffect, useState } from "react";
import { Modal as CreateFormModal } from "flowbite-react";
import Button from "../button";
import { CreateFormProps } from "./types";
import { FormFieldComponent } from "./form-field";
import { WarningModal } from "./warning-modal";
import { useFormState } from "./use-form-state";

const CreateForm = <T,>({
  fields,
  initialValues,
  isSplit = false,
  handleSubmit,
  element,
  onFormChange,
  open,
  setOpen,
  headerText,
  modalSize = "lg",
}: CreateFormProps<T>) => {
  const {
    formValues,
    setFormValues,
    handleChange,
    isFormValid,
    resetForm
  } = useFormState<T>({ fields, initialValues, onFormChange });

  const [showWarning, setShowWarning] = useState(false);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await handleSubmit(formValues);
    resetForm();
  };

  const onCloseModal = () => {
    const hasChanges = Object.keys(formValues).length > 0;
    if (hasChanges) {
      setShowWarning(true);
    } else {
      setOpen(false);
    }
  };

  const onClearWarning = () => {
    setShowWarning(false);
    resetForm();
    setOpen(false);
  };

  const onCancelChange = () => {
    setOpen(true);
    setShowWarning(false);
  };

  const renderFields = (fieldArray: typeof fields) => (
    fieldArray.map((field, index) => (
      <div key={index}>
        <FormFieldComponent
          field={field}
          value={formValues[field.name]}
          onChange={handleChange}
        />
      </div>
    ))
  );

  return (
    <>
      <CreateFormModal
        show={open}
        onClose={onCloseModal}
        className="bg-[#111928] bg-opacity-40 md:!h-full !h-full"
        size={modalSize}
        dismissible={true}
      >
        <CreateFormModal.Header>{headerText}</CreateFormModal.Header>
        <form onSubmit={handleFormSubmit}>
          <CreateFormModal.Body>
            <div className={`gap-5 flex ${!isSplit && "w-full"}`}>
              <div className="flex-1">
                {renderFields(isSplit ? fields.slice(0, 8) : fields)}
                {!isSplit && element}
              </div>
              {isSplit && (
                <div className="flex-1">
                  {renderFields(fields.slice(8))}
                  {element}
                </div>
              )}
            </div>
          </CreateFormModal.Body>
          <CreateFormModal.Footer>
            <Button
              text="Сохранить"
              variant="create"
              type="submit"
              disabled={!isFormValid()}
            />
          </CreateFormModal.Footer>
        </form>
      </CreateFormModal>

      <WarningModal
        open={showWarning}
        setOpen={setShowWarning}
        onCancel={onCancelChange}
        onConfirm={onClearWarning}
      />
    </>
  );
};

export default CreateForm;
