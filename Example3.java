import java.util.List;

@ProjectedPayload
public interface Example4 {
    @XBRead("//userName")
    String getUserName();
}

public class Example3 extends BaseClass implements InterfaceOne, InterfaceTwo {
    public void exampleMethodOne() {
    }

    private int exampleMethodTwo() {
        return 0;
    }
}
