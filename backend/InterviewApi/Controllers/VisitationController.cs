using Microsoft.AspNetCore.Mvc;
using InterviewApi.Models;
using InterviewApi.Services;

namespace InterviewApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class VisitController : ControllerBase
{

    // <summary>
    // Get all visits with customer details(id, name) and hotel name
    // </summary>
    [HttpGet]
    public ActionResult<List<object>> GetAllVisits()
    {
        var visitations = DataService.ReadVisitationsFromJson();
        var customers = DataService.ReadCustomersFromJson();
        var hotels = DataService.ReadHotelsFromJson();

        var result = visitations.Select(v => new
        {
            v.Id,
            Customer = customers.FirstOrDefault(c => c.Id == v.CustomerId),
            Hotel = hotels.FirstOrDefault(h => h.Id == v.HotelId),
            v.VisitDate
        }).ToList();

        return Ok(result);
    }

    // <summary>
    // Get all visits for a specific customer by customer ID
    // </summary>
    [HttpGet("{customerId}")]
    public ActionResult<List<Visitation>> GetVisitsForCustomer(int customerId)
    {
        var visitations = DataService.ReadVisitationsFromJson();
        var customerVisits = visitations.Where(v => v.CustomerId == customerId).ToList();

        if (!customerVisits.Any())
        {
            return NotFound(new { error = $"No visitations found for customer with ID {customerId}" });
        }

        return Ok(customerVisits);
    }

    // <summary>
    // Add a new visit for a specific customer
    // </summary>
    [HttpPost]
    public ActionResult<Visitation> AddVisitForCustomer([FromBody] Visitation visitation)
    {
        // Validate the visitation data
        if (visitation.CustomerId == 0 || visitation.HotelId == 0 || visitation.VisitDate == default)
        {
            return BadRequest(new { error = "Customer ID, Hotel ID, and Visit Date are required" });
        }

        var visitations = DataService.ReadVisitationsFromJson();

        // Generate a new ID for the visitation
        visitation.Id = visitations.Count > 0 ? visitations.Max(v => v.Id) + 1 : 1;

        // Add the new visitation
        visitations.Add(visitation);

        // Write the updated visitations list to the JSON file
        DataService.WriteVisitationsToJson(visitations);

        return CreatedAtAction(nameof(GetVisitsForCustomer), new { customerId = visitation.CustomerId }, visitation);
    }
}
