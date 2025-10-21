// Services/DataService.cs
using InterviewApi.Models;
using System.Text.Json;

namespace InterviewApi.Services;

public class DataService
{
    private static readonly string _hotelsDataPath = Path.Combine(Directory.GetCurrentDirectory(), "Data", "hotels.json");
    private static readonly string _visitationsDataPath = Path.Combine(Directory.GetCurrentDirectory(), "Data", "visitations.json");
    private static readonly string _customersDataPath = Path.Combine(Directory.GetCurrentDirectory(), "Data", "customers.json");

    /// <summary>
    /// Helper method to read hotels from JSON file
    /// </summary>
    public static List<Hotel> ReadHotelsFromJson()
    {
        try
        {
            if (!File.Exists(_hotelsDataPath))
                return new List<Hotel>();

            var json = File.ReadAllText(_hotelsDataPath);
            var data = JsonSerializer.Deserialize<HotelData>(json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
            return data?.Hotels ?? new List<Hotel>();
        }
        catch
        {
            return new List<Hotel>();
        }
    }

    // <summary>
    // Helper method to read visitations from JSON file
    // </summary>
    public static List<Visitation> ReadVisitationsFromJson()
    {
        try
        {
            if (!File.Exists(_visitationsDataPath))
                return new List<Visitation>();

            var json = File.ReadAllText(_visitationsDataPath);
            var data = JsonSerializer.Deserialize<VisitationData>(json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
            return data?.Visitations ?? new List<Visitation>();
        }
        catch
        {
            return new List<Visitation>();
        }
    }

    // <summary>
    // Helper method to write visitations to JSON file
    // </summary>
    public static void WriteVisitationsToJson(List<Visitation> visitations)
    {
        try
        {
            var data = new VisitationData { Visitations = visitations };
            var json = JsonSerializer.Serialize(data, new JsonSerializerOptions { WriteIndented = true });
            File.WriteAllText(_visitationsDataPath, json);
        }
        catch
        {
            // Handle error if needed
        }
    }

    /// <summary>
    /// Helper method to read customers from JSON file
    /// </summary>
    public static List<Customer> ReadCustomersFromJson()
    {
        try
        {
            if (!File.Exists(_customersDataPath))
                return new List<Customer>();

            var json = File.ReadAllText(_customersDataPath);
            var data = JsonSerializer.Deserialize<CustomerData>(json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

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
    public static void WriteCustomersToJson(List<Customer> customers)
    {
        try
        {
            var data = new CustomerData { Customers = customers };
            var json = JsonSerializer.Serialize(data, new JsonSerializerOptions { WriteIndented = true });
            File.WriteAllText(_customersDataPath, json);
        }
        catch
        {
            // Handle error as needed
        }
    }
}
