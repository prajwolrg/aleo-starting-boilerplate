// The 'hello_leo' program.
program hello_leo.aleo {

    record Hello{
        owner: address,
        sum: u32
    }

    transition hello(public a: u32, b: u32) -> Hello {
        let sum: u32 = a + b;
        return Hello {
            owner: self.caller,
            sum
        };
    }
}
