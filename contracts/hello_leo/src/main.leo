// The 'hello_leo' program.
program hello_leo.aleo {

    struct Person{
        first_name: u32,
        second_name: u32
    }

    record Greeting{
        owner: address,
        full_name: u32
    }

    transition greet(p: Person) -> Greeting {
        let full_name: u32 = p.first_name + p.second_name;
        return Greeting {
            owner: self.caller,
            full_name
        };
    }
}
