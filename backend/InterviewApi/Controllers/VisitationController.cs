using Microsoft.AspNetCore.Mvc;
using InterviewApi.Models;
using System.Text.Json;

namespace InterviewApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class VisitController : ControllerBase
{
    private readonly string _visitationsDataPath = Path.Combine(Directory.GetCurrentDirectory(), "Data", "visitations.json");

    /// <summary>
    /// Get all visits for a specific customer by customer ID
    /// </summary>
    [HttpGet("{customerId}")]
    public ActionResult<List<Visitation>> GetVisitsForCustomer(int customerId)
    {
        var visitations = ReadVisitationsFromJson();
        var customerVisits = visitations.Where(v => v.CustomerId == customerId).ToList();

        if (!customerVisits.Any())
        {
            return NotFound(new { error = $"No visitations found for customer with ID {customerId}" });
        }

        return Ok(customerVisits);
    }

    /// <summary>
    /// Add a new visit for a specific customer
    /// </summary>
    [HttpPost]
    public ActionResult<Visitation> AddVisitForCustomer([FromBody] Visitation visitation)
    {
        // Validate the visitation data
        if (visitation.CustomerId == 0 || visitation.HotelId == 0 || visitation.VisitDate == default)
        {
            return BadRequest(new { error = "Customer ID, Hotel ID, and Visit Date are required" });
        }

        var visitations = ReadVisitationsFromJson();

        // Generate a new ID for the visitation
        visitation.Id = visitations.Count > 0 ? visitations.Max(v => v.Id) + 1 : 1;

        // Add the new visitation
        visitations.Add(visitation);

        // Write the updated visitations list to the JSON file
        WriteVisitationsToJson(visitations);

        return CreatedAtAction(nameof(GetVisitsForCustomer), new { customerId = visitation.CustomerId }, visitation);
    }

    /// <summary>
    /// Helper method to read visitations from JSON file
    /// </summary>
    private List<Visitation> ReadVisitationsFromJson()
    {
        try
        {
            if (!System.IO.File.Exists(_visitationsDataPath))
                return new List<Visitation>();

            var json = System.IO.File.ReadAllText(_visitationsDataPath);
            var data = JsonSerializer.Deserialize<VisitationData>(json);
            return data?.Visitations ?? new List<Visitation>();
        }
        catch
        {
            return new List<Visitation>();
        }
    }

    /// <summary>
    /// Helper method to write visitations to JSON file
    /// </summary>
    private void WriteVisitationsToJson(List<Visitation> visitations)
    {
        try
        {
            var data = new VisitationData { Visitations = visitations };
            var json = JsonSerializer.Serialize(data, new JsonSerializerOptions { WriteIndented = true });
            System.IO.File.WriteAllText(_visitationsDataPath, json);
        }
        catch
        {
            // Handle error if needed
        }
    }
}
