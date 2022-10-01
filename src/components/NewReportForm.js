import { useForm } from '@mantine/form';
import { TextInput } from '@mantine/core';


function NewReportForm() {

  const form = useForm({
    initialValues: {

    }

  });

  return <div>
    <form>
      <TextInput />
    </form>
  </div>;
}

export default NewReportForm;
