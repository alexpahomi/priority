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
        var hotels = DataService.ReadHotelsFromJson();
        var customerVisits = visitations.Where(v => v.CustomerId == customerId).ToList();

        if (!customerVisits.Any())
        {
            return NotFound(new { error = $"No visitations found for customer with ID {customerId}" });
        }

        var result = customerVisits
            .OrderByDescending(v => v.VisitDate)
            .Select(v => new
            {
                v.Id,
                HotelId = v.HotelId,
                HotelName = hotels.FirstOrDefault(h => h.Id == v.HotelId)?.Name ?? "Unknown",
                VisitDate = v.VisitDate
            })
            .ToList();

        return Ok(result);
    }

    /// <summary>
    /// Get filtered visits based on query parameters: hotelIds, month, onlyLoyal
    /// </summary>
    [HttpGet("filtered")]
    public ActionResult<List<object>> GetFilteredVisits([FromQuery] string? hotelIds, [FromQuery] string? month, [FromQuery] bool onlyLoyal = false)
    {
        var visitations = DataService.ReadVisitationsFromJson();
        var customers = DataService.ReadCustomersFromJson();
        var hotels = DataService.ReadHotelsFromJson();

        // Filter by month if provided
        if (!string.IsNullOrEmpty(month))
        {
            DateTime targetDate;
            if (DateTime.TryParseExact(month, "MM/yyyy", null, System.Globalization.DateTimeStyles.None, out targetDate))
            {
                visitations = visitations
                    .Where(v => v.VisitDate.Year == targetDate.Year && v.VisitDate.Month == targetDate.Month)
                    .ToList();
            }
        }

        // Filter by hotel IDs if provided
        if (!string.IsNullOrEmpty(hotelIds))
        {
            var hotelIdList = hotelIds.Split(',').Select(int.Parse).ToList();
            visitations = visitations.Where(v => hotelIdList.Contains(v.HotelId)).ToList();
        }

        // Filter by loyal customers if checkbox is checked
        if (onlyLoyal)
        {
            DateTime targetMonth;
            if (!string.IsNullOrEmpty(month) && DateTime.TryParseExact(month, "MM/yyyy", null, System.Globalization.DateTimeStyles.None, out targetMonth))
            {
                targetMonth = new DateTime(targetMonth.Year, targetMonth.Month, 1);
            }
            else
            {
                targetMonth = new DateTime(DateTime.Now.Year, DateTime.Now.Month, 1);
            }

            var loyalCustomerIds = LoyalCustomerService.GetLoyalCustomerIds(targetMonth);
            visitations = visitations.Where(v => loyalCustomerIds.Contains(v.CustomerId)).ToList();
        }

        // Build result with customer and hotel details
        var result = visitations
            .OrderBy(v => v.VisitDate)
            .Select(v => new
            {
                v.Id,
                CustomerId = v.CustomerId,
                CustomerName = customers.FirstOrDefault(c => c.Id == v.CustomerId)?.Name ?? "Unknown",
                HotelId = v.HotelId,
                HotelName = hotels.FirstOrDefault(h => h.Id == v.HotelId)?.Name ?? "Unknown",
                VisitDate = v.VisitDate
            })
            .ToList();

        return Ok(result);
    }

    // <summary>
    // Add a new visit for a specific customer
    // </summary>
    [HttpPost]
    public ActionResult<Visitation> AddVisitForCustomer([FromBody] Visitation visitation)
    {
        if (visitation.CustomerId == 0 || visitation.HotelId == 0 || visitation.VisitDate == default)
        {
            return BadRequest(new { error = "Customer ID, Hotel ID, and Visit Date are required" });
        }

        var visitations = DataService.ReadVisitationsFromJson();
        visitation.Id = visitations.Count > 0 ? visitations.Max(v => v.Id) + 1 : 1;
        visitations.Add(visitation);

        DataService.WriteVisitationsToJson(visitations);

        return StatusCode(201, visitation);
    }
}
