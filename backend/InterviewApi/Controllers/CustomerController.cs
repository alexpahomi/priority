using Microsoft.AspNetCore.Mvc;
using InterviewApi.Models;
using System.Text.Json;

namespace InterviewApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CustomerController : ControllerBase
{
    private readonly string _dataPath = Path.Combine(Directory.GetCurrentDirectory(), "Data", "customers.json");

    /// <summary>
    /// Welcome endpoint - returns a welcome message
    /// </summary>
    [HttpGet("welcome")]
    public ActionResult<object> Welcome()
    {
        return Ok(new
        {
            message = "Welcome to Priority Customer Management API!",
            version = "1.0.0",
            dataSource = "JSON file: Data/customers.json",
            endpoints = new[]
            {
                "GET /api/customer/welcome - This endpoint",
                "POST /api/customer - Add new customer",
                "GET /api/customer/{id} - Get a customer by ID",
                "GET /api/customer/loyal - Find loyal customers at date",
                "POST /api/customer/register - Register a customer at date"
            },
            note = "Use the customers.json file in the Data folder as your data source"
        });
    }

    /// <summary>
    /// Helper method to read customers from JSON file
    /// </summary>
    private List<Customer> ReadCustomersFromJson()
    {
        try
        {
            if (!System.IO.File.Exists(_dataPath))
                return new List<Customer>();

            var json = System.IO.File.ReadAllText(_dataPath);
            var data = JsonSerializer.Deserialize<CustomerData>(json);
            return data?.Customers ?? new List<Customer>();
        }
        catch
        {
            return new List<Customer>();
        }
    }

    /// <summary>
    /// Helper method to write customers to JSON file
    /// </summary>
    private void WriteCustomersToJson(List<Customer> customers)
    {
        try
        {
            var data = new CustomerData { Customers = customers };
            var json = JsonSerializer.Serialize(data, new JsonSerializerOptions { WriteIndented = true });
            System.IO.File.WriteAllText(_dataPath, json);
        }
        catch
        {
            // Handle error as needed
        }
    }

    // TODO: Implement this endpoint
    // Add a new customer
    // POST /api/customer
    // Request body: { "name": "John Doe", "email": "john@example.com" }
    // Response: Created customer with ID
    /*
    [HttpPost]
    public ActionResult<Customer> AddCustomer([FromBody] Customer customer)
    {
        // Your implementation here:
        // 1. Validate the customer data (name, email required)
        // 2. Read existing customers from JSON: var customers = ReadCustomersFromJson();
        // 3. Generate new ID: customer.Id = customers.Max(c => c.Id) + 1;
        // 4. Set registration date: customer.RegistrationDate = DateTime.Now;
        // 5. Add to list: customers.Add(customer);
        // 6. Save to JSON: WriteCustomersToJson(customers);
        // 7. Return 201 Created status
        
        return CreatedAtAction(nameof(GetCustomer), new { id = customer.Id }, customer);
    }
    */

    // TODO: Implement this endpoint
    // Get a customer by ID
    // GET /api/customer/{id}
    // Response: Customer details
    /*
    [HttpGet("{id}")]
    public ActionResult<Customer> GetCustomer(int id)
    {
        // Your implementation here:
        // 1. Read customers from JSON: var customers = ReadCustomersFromJson();
        // 2. Find customer by ID: var customer = customers.FirstOrDefault(c => c.Id == id);
        // 3. Return 404 if not found: if (customer == null) return NotFound();
        // 4. Return customer if found: return Ok(customer);
        
        return Ok(customer);
    }
    */

    // TODO: Implement this endpoint
    // Find loyal customers at a specific date
    // GET /api/customer/loyal?date=2024-01-01
    // Query parameter: date (optional, defaults to today)
    // Response: List of loyal customers (e.g., customers with TotalPurchases > 10)
    /*
    [HttpGet("loyal")]
    public ActionResult<List<Customer>> GetLoyalCustomers([FromQuery] DateTime? date)
    {
        // Your implementation here:
        // 1. Use date parameter (or default to DateTime.Now): var targetDate = date ?? DateTime.Now;
        // 2. Read customers from JSON: var customers = ReadCustomersFromJson();
        // 3. Define criteria for "loyal customer" (e.g., TotalPurchases > 10)
        // 4. Filter customers: 
        //    - Registered before or on the given date: c.RegistrationDate <= targetDate
        //    - Meet loyalty criteria: c.TotalPurchases > 10
        // 5. Return list of loyal customers: return Ok(loyalCustomers);
        
        return Ok(loyalCustomers);
    }
    */

    // TODO: Implement this endpoint
    // Register a customer at a specific date
    // POST /api/customer/register
    // Request body: { "name": "Jane Doe", "email": "jane@example.com", "registrationDate": "2024-01-01" }
    // Response: Registered customer
    /*
    [HttpPost("register")]
    public ActionResult<Customer> RegisterCustomer([FromBody] Customer customer)
    {
        // Your implementation here:
        // 1. Validate customer data (name, email required)
        // 2. Read existing customers from JSON: var customers = ReadCustomersFromJson();
        // 3. Generate new ID: customer.Id = customers.Max(c => c.Id) + 1;
        // 4. Use RegistrationDate from request (or default to DateTime.Now if not provided)
        // 5. Set TotalPurchases to 0 for new customer: customer.TotalPurchases = 0;
        // 6. Add to list: customers.Add(customer);
        // 7. Save to JSON: WriteCustomersToJson(customers);
        // 8. Return 201 Created status
        
        return CreatedAtAction(nameof(GetCustomer), new { id = customer.Id }, customer);
    }
    */
}

