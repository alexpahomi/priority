namespace InterviewApi.Models;

public class InterviewAssignment
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Duration { get; set; } = string.Empty;
    public string Contact { get; set; } = string.Empty;
}

public class Customer
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public DateTime RegistrationDate { get; set; }
    public int TotalPurchases { get; set; }
}

public class CustomerData
{
    public List<Customer> Customers { get; set; } = new List<Customer>();
}

