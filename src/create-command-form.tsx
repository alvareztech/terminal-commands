import { Action, ActionPanel, Form, useNavigation } from "@raycast/api";
import { FormValidation, useForm } from "@raycast/utils";

interface CreateCommandValues {
  name: string;
  command: string;
}

export function CreateCommandForm(props: { onCreate: (values: CreateCommandValues) => Promise<void> }) {
  const { pop } = useNavigation();
  const { handleSubmit, itemProps } = useForm<CreateCommandValues>({
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
      navigationTitle="Create Command"
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Save Command" onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextField title="Name" placeholder="Ping Google DNS" {...itemProps.name} />
      <Form.TextArea title="Command" placeholder={"cd ~/Developer\nls -la"} {...itemProps.command} />
    </Form>
  );
}
