import { Action, ActionPanel, Form, useNavigation } from "@raycast/api";
import { FormValidation, useForm } from "@raycast/utils";

interface CrearComandoValues {
  name: string;
  command: string;
}

export function CrearComando(props: { onCreate: (values: CrearComandoValues) => Promise<void> }) {
  const { pop } = useNavigation();
  const { handleSubmit, itemProps } = useForm<CrearComandoValues>({
    async onSubmit(values) {
      await props.onCreate({ name: values.name.trim(), command: values.command.trim() });
      pop();
    },
    validation: {
      name: FormValidation.Required,
      command: FormValidation.Required,
    },
  });

  return (
    <Form
      navigationTitle="Crear comando"
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Guardar Comando" onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextField title="Nombre" placeholder="Ping Google DNS" {...itemProps.name} />
      <Form.TextField title="Comando" placeholder="ping 8.8.8.8" {...itemProps.command} />
    </Form>
  );
}
