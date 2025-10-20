using Microsoft.AspNetCore.Mvc;
using InterviewApi.Models;
using InterviewApi.Services;

namespace InterviewApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CustomerController : ControllerBase
{
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
    /// Get all customers
    /// </summary>
    [HttpGet]
    public ActionResult<List<Customer>> GetCustomers()
    {
        var customers = DataService.ReadCustomersFromJson();
        return Ok(customers);
    }

    // TODO: Implement this endpoint
    // Add a new customer
    // POST /api/customer
    // Request body: { "name": "John Doe", "email": "john@example.com" }
    // Response: Created customer with ID

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

        if (string.IsNullOrWhiteSpace(customer.Name) || string.IsNullOrWhiteSpace(customer.Email))
        {
            return BadRequest(new { error = "Name and email are required" });
        }
        else if (!customer.Email.Contains('@'))
        {
            return BadRequest(new { error = "Invalid email format" });
        }

        var customers = DataService.ReadCustomersFromJson();
        customer.Id = customers.Count > 0 ? customers.Max(c => c.Id) + 1 : 1;

        customer.RegistrationDate = DateTime.Now;
        customer.TotalPurchases = 0;

        customers.Add(customer);

        DataService.WriteCustomersToJson(customers);

        return CreatedAtAction(nameof(GetCustomer), new { id = customer.Id }, customer);
    }

    // TODO: Implement this endpoint
    // Get a customer by ID
    // GET /api/customer/{id}
    // Response: Customer details

    [HttpGet("{id}")]
    public ActionResult<Customer> GetCustomer(int id)
    {
        // Your implementation here:
        // 1. Read customers from JSON: var customers = ReadCustomersFromJson();
        // 2. Find customer by ID: var customer = customers.FirstOrDefault(c => c.Id == id);
        // 3. Return 404 if not found: if (customer == null) return NotFound();
        // 4. Return customer if found: return Ok(customer);

        var customers = DataService.ReadCustomersFromJson();
        var customer = customers.FirstOrDefault(c => c.Id == id);
        if (customer == null)
            return NotFound(new { error = $"Customer with ID {id} not found" });

        return Ok(customer);
    }

    // TODO: Implement this endpoint
    // Find loyal customers at a specific date
    // GET /api/customer/loyal?date=2024-01-01
    // Query parameter: date (optional, defaults to today)
    // Response: List of loyal customers (e.g., customers with TotalPurchases > 10)
    // ------------------------------------------------------------------------------------------    
    // Response: List of loyal customers who visit the same hotel on the same day of the week for an entire month
    // A loyal customer visits the same hotel on the same day of the week for all occurrences of that day in a month.
    // Example: A customer visiting "Grand Hotel" every Monday throughout October (even if they have 1 visit on Sunday)

    [HttpGet("loyal")]
    public ActionResult<List<Customer>> GetLoyalCustomers([FromQuery] string date)
    {
        // Your implementation here:
        // 1. Use date parameter (or default to DateTime.Now): var targetDate = date ?? DateTime.Now;
        // 2. Read customers from JSON: var customers = ReadCustomersFromJson();
        // 3. Define criteria for "loyal customer" (e.g., TotalPurchases > 10) - visits on each occurrence of a day of week in month - at least 1 day of week
        // 4. Filter customers by loyalty:
        // 5. Return list of loyal customers: return Ok(loyalCustomers);

        // v1 - full date recieved
        // var targetDate = date ?? DateTime.Now;

        // v2 - parse date in MM/yyyy format
        DateTime targetDate;
        if (!DateTime.TryParseExact(date, "MM/yyyy", null, System.Globalization.DateTimeStyles.None, out targetDate))
        {
            targetDate = DateTime.Now; // default to current date if parsing failed
        }

        var targetMonth = new DateTime(targetDate.Year, targetDate.Month, 1);

        var customers = DataService.ReadCustomersFromJson();
        var visitations = DataService.ReadVisitationsFromJson();

        var monthVisitations = visitations
            .Where(v => v.VisitDate.Year == targetMonth.Year && v.VisitDate.Month == targetMonth.Month)
            .ToList();

        // group visitations by customer and hotel
        var customerHotelGroups = monthVisitations
            .GroupBy(v => new { v.CustomerId, v.HotelId })
            .ToList();

        var loyalCustomerIds = new HashSet<int>();
        var expectedDayOfWeekCounts = CalculateExpectedDayOfWeekCounts(targetMonth, targetMonth.Year == DateTime.Now.Year && targetMonth.Month == DateTime.Now.Month);

        foreach (var group in customerHotelGroups)
        {
            // v1 - initially required week day visits >= 4 (actualCount >= 4)
            /*
            var visitsByDay = group
                .GroupBy(v => v.VisitDate.DayOfWeek) // Group visits by the day of the week
                .ToList();

            // Check if any day has 4 or more visits in the month
            foreach (var dayGroup in visitsByDay)
            {
                if (dayGroup.Count() >= 4) // Loyal customers should visit at least 4 times in a month on the same day
                {
                    loyalCustomerIds.Add(group.Key.CustomerId); // Add the customer ID to loyal list
                }
            }
            */

            // v2 - revised to match all occurrences of a day of week in month
            var visitDayOfWeekCounts = group
                .GroupBy(v => v.VisitDate.DayOfWeek)
                .ToDictionary(g => g.Key, g => g.Count());

            foreach (var kvp in expectedDayOfWeekCounts)
            {
                var dayOfWeek = kvp.Key;
                var expectedCount = kvp.Value;

                // 

                if (expectedCount > 0 &&
                    visitDayOfWeekCounts.TryGetValue(dayOfWeek, out int actualCount) &&
                    actualCount == expectedCount)
                {
                    loyalCustomerIds.Add(group.Key.CustomerId);
                    break; // chck no further for this customer-hotel group
                }
            }
        }

        var loyalCustomers = customers
            .Where(c => loyalCustomerIds.Contains(c.Id))
            .ToList();

        return Ok(loyalCustomers);
    }

    /// <summary>
    /// Helper method to calculate how many times each day of week occurs in a month
    /// For current month, counts only up to today
    /// For past/future months, counts the entire month
    /// </summary>
    private Dictionary<DayOfWeek, int> CalculateExpectedDayOfWeekCounts(DateTime month, bool isCurrentMonth)
    {
        Dictionary<DayOfWeek, int> counts = new();
        int lastDay = isCurrentMonth ? DateTime.Now.Day : DateTime.DaysInMonth(month.Year, month.Month);

        var daysInMonth = Enumerable.Range(1, lastDay)
            .Select(d => new DateTime(month.Year, month.Month, d));

        counts = daysInMonth
            .GroupBy(d => d.DayOfWeek)
            .ToDictionary(g => g.Key, g => g.Count());

        // Ensure all days of week are in the dictionary (with 0 if not present)
        foreach (DayOfWeek day in Enum.GetValues(typeof(DayOfWeek)))
        {
            if (!counts.ContainsKey(day))
                counts[day] = 0;
        }

        return counts;
    }

    // TODO: Implement this endpoint
    // Register a customer at a specific date
    // POST /api/customer/register
    // Request body: { "name": "Jane Doe", "email": "jane@example.com", "registrationDate": "2024-01-01" }
    // Response: Registered customer
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

        if (string.IsNullOrWhiteSpace(customer.Name) || string.IsNullOrWhiteSpace(customer.Email))
        {
            return BadRequest(new { error = "Name and email are required" });
        }
        else if (!customer.Email.Contains('@'))
        {
            return BadRequest(new { error = "Invalid email format" });
        }

        var customers = DataService.ReadCustomersFromJson();

        customer.Id = customers.Count > 0 ? customers.Max(c => c.Id) + 1 : 1;
        customer.TotalPurchases = 0;
        if (customer.RegistrationDate == default)
        {
            customer.RegistrationDate = DateTime.Now;
        }

        customers.Add(customer);

        DataService.WriteCustomersToJson(customers);

        return CreatedAtAction(nameof(GetCustomer), new { id = customer.Id }, customer);
    }
}

