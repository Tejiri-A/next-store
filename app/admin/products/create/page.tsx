import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";
import { toast } from "sonner";
import { faker } from "@faker-js/faker";
import FormInput from "@/components/form/FormInput";
import PriceInput from "@/components/form/PriceInput";


function CreateProductPage() {
  const name = faker.commerce.productName();
  const companyName = faker.company.name();
  const secription = faker.lorem.paragraph({ min: 10, max: 12 });
  return (
    <section>
      <h1 className="text-2xl font-semibold mb-8 capitalize">create product</h1>
      <div className="border p-8 rounded-md">
        <form action="">
          <FormInput type="text" name="name" label="product name" defaultValue={name}/>
          <PriceInput />
          <Button type="submit" size={"lg"}>
            Submit
          </Button>
        </form>
      </div>
    </section>
  );
}

async function createProductAction(formData: FormData) {
  "use server";
  const name = formData.get("name");
  console.log(name);
}

export default CreateProductPage;
